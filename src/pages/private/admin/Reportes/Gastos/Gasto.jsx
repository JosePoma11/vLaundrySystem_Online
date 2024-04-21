/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";
import { MantineReactTable } from "mantine-react-table";
import axios from "axios";
import ExcelJS from "exceljs";

import { Box, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { MonthPickerInput } from "@mantine/dates";
import "./gasto.scss";
import { Notify } from "../../../../../utils/notify/Notify";
import moment from "moment";
import { simboloMoneda } from "../../../../../services/global";
import SwitchModel from "../../../../../components/SwitchModel/SwitchModel";
import "./gasto.scss";
import { useEffect } from "react";

const Gasto = ({ onClose }) => {
  const [datePrincipal, setDatePrincipal] = useState(new Date());
  const [infoGasto, setInfoGasto] = useState([]);
  const [infoPie, setInfoPie] = useState([]);
  const [filterBy, setFilterBy] = useState("monto");
  const [loading, setLoading] = useState(false);

  // const data = [
  //   {
  //     id: "1",
  //     name: "Delivery (Envio)",
  //     cantidad: 559,
  //     monto: 1560,
  //     infoGastos: [
  //       {
  //         motivo: "motivo x",
  //         date: {
  //           fecha: "2024-04-17",
  //           hora: "11:26",
  //         },
  //         monto: 12,
  //         infoUser: {
  //           name: "Joel",
  //           rol: "Administrador",
  //         },
  //       },
  //       {
  //         motivo: "motivo x",
  //         date: {
  //           fecha: "2024-04-01",
  //           hora: "11:26",
  //         },
  //         monto: 8,
  //         infoUser: {
  //           name: "Joel",
  //           rol: "Administrador",
  //         },
  //       },
  //       {
  //         motivo: "motivo x",
  //         date: {
  //           fecha: "2024-04-05",
  //           hora: "11:26",
  //         },
  //         monto: 7,
  //         infoUser: {
  //           name: "Joel",
  //           rol: "Administrador",
  //         },
  //       },
  //       {
  //         motivo: "motivo x",
  //         date: {
  //           fecha: "2024-04-03",
  //           hora: "11:26",
  //         },
  //         monto: 16,
  //         infoUser: {
  //           name: "Joel",
  //           rol: "Administrador",
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     name: "Delivery (Recojo)",
  //     cantidad: 559,
  //     monto: 1423,
  //     infoGastos: [
  //       {
  //         motivo: "motivo x",
  //         date: {
  //           fecha: "2024-04-03",
  //           hora: "11:26",
  //         },
  //         monto: 16,
  //         infoUser: {
  //           name: "Joel",
  //           rol: "Administrador",
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     id: "3",
  //     name: "Alquiler",
  //     cantidad: 1,
  //     monto: 1448,
  //     infoGastos: [
  //       {
  //         motivo: "motivo x",
  //         date: {
  //           fecha: "2024-04-01",
  //           hora: "11:26",
  //         },
  //         monto: 8,
  //         infoUser: {
  //           name: "Joel",
  //           rol: "Administrador",
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     id: "4",
  //     name: "Gas",
  //     cantidad: 3,
  //     monto: 260,
  //     infoGastos: [
  //       {
  //         motivo: "motivo x",
  //         date: {
  //           fecha: "2024-04-05",
  //           hora: "11:26",
  //         },
  //         monto: 7,
  //         infoUser: {
  //           name: "Joel",
  //           rol: "Administrador",
  //         },
  //       },
  //     ],
  //   },
  // ];

  const columns = useMemo(
    () => [
      {
        header: "Tipo de Gasto",
        accessorKey: "name",
        size: 120,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Cantidad Total",
        accessorKey: "cantidad",
        enableColumnFilter: false,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        size: 120,
      },
      {
        header: "Monto Neto",
        accessorKey: "monto",
        size: 70,
        enableColumnFilter: false,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        Cell: ({ cell }) => (
          <Box>
            {simboloMoneda} {cell.getValue()}
          </Box>
        ),
      },
    ],
    []
  );

  const handleGetGastos = async () => {
    const fechaFormateada = moment(datePrincipal).format("YYYY-MM-DD");
    try {
      // Llamar a la API con la fecha formateada
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/lava-ya/get-gastos/${fechaFormateada}`
      );
      const iTransform = await handleTransformData(response.data);

      // Guardar la respuesta en setInfoGasto
      setInfoGasto(response.data);
      setInfoPie(iTransform);
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
    }
  };

  const openModal = () => {
    onClose();
    const month = moment.utc(datePrincipal).format("MMMM");
    modals.openConfirmModal({
      title: "Reporte de Gasto Mensual",
      centered: true,
      children: (
        <Text size="sm">
          ¿ Desea Generar Reporte de : {month.toUpperCase()} ?
        </Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      onConfirm: () => exportToExcel(),
    });
  };

  const handleTransformData = (info) => {
    // Mapear los datos y devolver un objeto con las propiedades necesarias
    const transformedData = info.map((tipo) => {
      return {
        id: tipo.id,
        label: tipo.name,
        value: filterBy === "cantidad" ? tipo.cantidad : tipo.monto,
      };
    });

    // Ordenar los datos de menor a mayor basado en el valor
    transformedData.sort((a, b) => a.value - b.value);

    return transformedData;
  };

  const procesarDatos = (data) => {
    // Array para almacenar los datos procesados
    const datosProcesados = [];

    // Recorrer cada elemento del array de datos
    data.forEach((item) => {
      // Recorrer cada gasto dentro de infoGastos
      item.infoGastos.forEach((gasto) => {
        // Crear un nuevo objeto con los campos requeridos
        const nuevoGasto = {
          tipo: item.name,
          motivo: gasto.motivo,
          monto: gasto.monto,
          fecha: gasto.date.fecha,
          responsable: `${gasto.infoUser.name} (${gasto.infoUser.rol})`,
        };

        // Agregar el nuevo objeto al array de datos procesados
        datosProcesados.push(nuevoGasto);
      });
    });

    // Ordenar los datos por fecha utilizando Moment.js
    datosProcesados.sort((a, b) => {
      const fechaA = moment(a.fecha, "YYYY-MM-DD");
      const fechaB = moment(b.fecha, "YYYY-MM-DD");
      return fechaA - fechaB;
    });

    // Retornar los datos procesados
    return datosProcesados;
  };

  const exportToExcel = async () => {
    const fileName = "Reporte de Gasto";
    const iGastosP = await procesarDatos(infoGasto);

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");
    // Estilos para el encabezado
    const headerStyle = {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "333333" }, // Color de fondo para la cabecera (gris oscuro)
      },
      font: {
        color: { argb: "FFFFFF" }, // Color del texto en la cabecera (blanco)
        bold: true, // Texto en negrita
      },
    };
    // Agregar la cabecera
    worksheet
      .addRow([
        "N° ",
        "Tipo de Gasto",
        "Motivo",
        "Monto",
        "Fecha",
        "Responsable",
      ])
      .eachCell((cell) => {
        cell.fill = headerStyle.fill;
        cell.font = headerStyle.font;
      });
    iGastosP.forEach((gasto, index) => {
      worksheet.addRow([
        index + 1,
        gasto.tipo,
        gasto.motivo,
        +gasto.monto,
        gasto.fecha,
        gasto.responsable,
      ]);
    });
    worksheet.eachRow((row) => {
      row.alignment = {
        wrapText: true,
        horizontal: "center",
        vertical: "middle",
      };
    });
    let maxLengthColumns = 0;
    await worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10;
        maxLength = Math.max(maxLength, cellLength);
      });

      // Establecer un ancho máximo para las columnas
      const maxWidth = 50; // Puedes ajustar este valor según tus necesidades

      // Establecer el ancho de la columna como el mínimo entre el ancho máximo y el ancho calculado
      column.width = Math.min(maxLength + 2, maxWidth);
    });
    // Aplicar autofiltro a todas las columnas y filas
    const totalRows = worksheet.rowCount;
    const totalColumns = worksheet.columnCount;
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: totalRows, column: totalColumns },
    };
    // Guardar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName + ".xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (!loading) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        exportToExcel();
      }, 2400);
    }
  };

  useEffect(() => {
    if (infoGasto.length > 0) {
      const sortedGasto = [...infoGasto].sort(
        (a, b) => b[filterBy] - a[filterBy]
      );
      setInfoGasto(sortedGasto);
    }
  }, [filterBy]);

  useEffect(() => {
    handleGetGastos();
  }, [datePrincipal]);

  return (
    <div className="content-reporte-gasto">
      <div className="pie-grafic">
        <ResponsivePie
          width={500}
          height={500}
          data={infoPie}
          margin={{ top: 40, bottom: 40, left: -220, right: 0 }}
          endAngle={180}
          innerRadius={0.5}
          colors={{ scheme: "set3" }}
          padAngle={0.7}
          cornerRadius={3}
          sortByValue
          arcLinkLabel={(info) => {
            return info.label;
          }}
          activeOuterRadiusOffset={8}
          arcLabel={(info) => {
            return `${filterBy === "monto" ? simboloMoneda : ""} ${
              info.value
            } ${filterBy === "cantidad" ? "u" : ""}`;
          }}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          tooltip={(e) => {
            let { datum: t } = e;
            return (
              <div className="design-tooltip">
                <span>Tipo Gasto: {t.label}</span>
                <br />
                <span>
                  {filterBy}: {t.value}
                </span>
              </div>
            );
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
        />
      </div>
      <div className="info-body">
        <h1 className="title">Reporte de Gastos Mensual</h1>
        <div className="accion-r">
          <SwitchModel
            title="Valorizar por :"
            onSwitch="Cantidad" // TRUE
            offSwitch="Monto" // FALSE
            name="valorizacion"
            defaultValue={filterBy === "cantidad" ? true : false}
            onChange={(value) => {
              if (value === true) {
                setFilterBy("cantidad");
              } else {
                setFilterBy("monto");
              }
            }}
          />
          <MonthPickerInput
            style={{ position: "relative", margin: "auto 0" }}
            label="Ingrese Fecha"
            placeholder="Pick date"
            value={datePrincipal}
            onChange={(date) => {
              setDatePrincipal(date);
            }}
            maw={400}
          />
          <button
            className={`button_wrapper ${loading ? "loading" : ""}`}
            onClick={handleExport}
          >
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.75"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
                />
              </svg>
            </div>
          </button>
        </div>
        <div className="list-gastos">
          <MantineReactTable
            columns={columns}
            data={infoGasto}
            initialState={{
              showColumnFilters: true,
              density: "xs",
              pagination: {},
              expanded: {
                1: false,
              },
            }}
            enableToolbarInternalActions={false}
            enableColumnActions={false}
            enableSorting={false}
            enableTopToolbar={false}
            mantineTableProps={{
              highlightOnHover: false,
            }}
            enableExpandAll={false}
            enablePagination={false}
            enableBottomToolbar={false}
            enableRowNumbers
            enableStickyHeader
            mantineTableContainerProps={{
              sx: {
                // maxHeight: "400px",
                // maxWidth: "1000px",
              },
            }}
            renderDetailPanel={({ row }) => (
              <div className="sub-row">
                <div className="gasto-by-tipo">
                  {row.original.infoGastos
                    // .slice()
                    // .sort((a, b) => b.index - a.index)
                    .map((gasto, index) => (
                      <table className="gasto-table" key={index}>
                        <tbody>
                          <tr>
                            <td>Hecho por :</td>
                            <td>
                              {gasto.infoUser.name} ({gasto.infoUser.rol})
                            </td>
                          </tr>
                          <tr>
                            <td>Motivo :</td>
                            <td style={{ textAlign: "justify" }}>
                              {gasto.motivo}
                            </td>
                          </tr>
                          <tr>
                            <td>Fecha :</td>
                            <td>
                              {gasto.date.fecha} - {gasto.date.hora}
                            </td>
                          </tr>
                          <tr>
                            <td>Monto :</td>
                            <td>
                              {simboloMoneda} {gasto.monto}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                </div>
              </div>
            )}
            // mantineTableBodyRowProps={({ row }) => ({
            //   onDoubleClick: () => {
            //     setRowPick(row.original);
            //     setPActions(true);
            //   },
            // })}
            positionExpandColumn="last"
          />
        </div>
      </div>

      {/* <button className="xport-xsls" onClick={openModal}>
        Exportar a Excel
      </button> */}
    </div>
  );
};

export default Gasto;
