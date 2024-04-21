/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { MantineReactTable } from "mantine-react-table";
import Clock from "../../../../components/Clock/Clock";

import icoTime from "./reloj.png";
import "./asistencia.scss";
import LoaderSpiner from "../../../../components/LoaderSpinner/LoaderSpiner";
import Portal from "../../../../components/PRIVATE/Portal/Portal";
import Maintenance from "./Accion/Maintenance";
import { useEffect } from "react";

const Asistencia = () => {
  const [infoPersonalSelected, setInfoPersonalSelected] = useState();
  const [onChangeHorario, setChangeHorario] = useState(false);
  const [rowPick, setRowPick] = useState();
  const [Loading, setLoading] = useState(false);
  const [timeCurrent, setTimeCurrent] = useState();

  const listPersonal = [
    {
      _id: "1",
      name: "Rosita",
      pagoByHour: 3.4,
    },
    {
      _id: "2",
      name: "Manuel",
      pagoByHour: 3,
    },
    {
      _id: "2",
      name: "Alejandra",
      pagoByHour: 4,
    },
  ];

  const infoByIdPersonal = {
    infoPersonal: {
      id: "1",
      name: "Manuel",
      horaIngreso: "08:30",
      horaSalida: "18:50",
      pagoByHour: 3.2,
    },

    // normal - cumpleaños - feriado pagado - feria no pagado - justificado - falta
    listAsiste: [
      {
        fecha: "2024-04-01",
        tipoRegistro: "normal",
        ingreso: {
          hora: "08:32",
          saved: true,
        },
        salida: {
          hora: "17:52",
          saved: true,
        },
        observacion: [],
        time: {
          hora: 9,
          minutos: 20,
        },
      },
      {
        fecha: "2024-04-02",
        tipoRegistro: "cumpleaños",
        ingreso: {
          hora: "08:14",
          saved: true,
        },
        salida: {
          hora: "18:03",
          saved: true,
        },
        observacion: [],
        time: {
          hora: 8,
          minutos: 45,
        },
      },
      {
        fecha: "2024-04-03",
        tipoRegistro: "feriado",
        ingreso: {
          hora: "08:03",
          saved: true,
        },
        salida: {
          hora: "17:23",
          saved: true,
        },
        observacion: [],
        time: {
          hora: 9,
          minutos: 20,
        },
      },
      {
        fecha: "2024-04-04",
        tipoRegistro: "normal",
        ingreso: {
          hora: "08:36",
          saved: true,
        },
        salida: {
          hora: "17:32",
          saved: true,
        },
        observacion: ["Ingreso tarde, por motivos de salud"],
        time: {
          hora: 9,
          minutos: 2,
        },
      },
      {
        fecha: "2024-04-05",
        tipoRegistro: "falta",
        ingreso: {
          hora: "",
          saved: false,
        },
        salida: {
          hora: "",
          saved: false,
        },
        observacion: [],
        time: {
          hora: 0,
          minutos: 0,
        },
      },
    ],
  };

  const [tableData, setTableData] = useState(() => infoByIdPersonal.listAsiste);

  const handleGetInfo = (id) => {
    setLoading(true);
    setTimeout(() => {
      console.log(id);
      setLoading(false);
      setInfoPersonalSelected(listPersonal.find((pers) => pers._id === id));
    }, 2000);
  };

  const handleSaveCell = (cell, value) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here
    tableData[cell.row.index][cell.column.id] = value;
    //send/receive api updates here
    setTableData([...tableData]); //re-render with new data
  };

  const columns = useMemo(
    () => [
      {
        header: "Fecha",
        accessorKey: "fecha",
        size: 120,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Hora Ingreso",
        accessorKey: "ingreso.hora",
        size: 70,
        mantineTableBodyCellProps: {
          align: "center",
        },
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Hora Salida",
        accessorKey: "salida.hora",
        size: 70,
        mantineTableBodyCellProps: {
          align: "center",
        },
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
      {
        header: "Observacion",
        accessorKey: "observacion",
        size: 70,
        mantineFilterTextInputProps: {
          placeholder: "",
        },
        mantineTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) =>
          cell.getValue().length > 0 ? (
            <i
              onClick={() => {
                cell.getValue().map((obs) => {
                  console.log(obs);
                });
              }}
              className="fa-solid fa-eye"
            ></i>
          ) : null,
      },
      {
        header: "Tiempo de Trabajo",
        accessorKey: "time.hora",
        size: 70,
        mantineTableBodyCellProps: {
          align: "center",
        },
        mantineFilterTextInputProps: {
          placeholder: "",
        },
      },
    ],
    []
  );

  const handleGetTime = (time) => {
    const { year, month, day, hour, minute } = time;

    return {
      fecha: `${year}-${month}-${day}`,
      hora: `${hour}:${minute}`,
    };
  };

  const handleMarkTime = (info, tipo) => {
    const infoTime = handleGetTime(timeCurrent);
    // const resFinal = {
    //   idUser: info._id,
    //   tipo,
    //   ...infoTime,
    // };
    // alert(
    //   `${resFinal.fecha} - ${resFinal.hora} | ${resFinal.tipo} | ${info.name}`
    // );

    if (tipo === "ingreso") {
      console.log("agregando");
      console.log({
        idPersonal: info._id,
        fecha: infoTime.fecha,
        ingreso: infoTime.hora,
        salida: "",
        time: "",
      });
    } else {
      console.log("editando");
      console.log({});
    }

    // console.log(resFinal);
  };

  const handleCloseAction = () => {
    setRowPick();
    setChangeHorario(false);
  };

  useEffect(() => {
    if (rowPick) {
      setChangeHorario(true);
    }
  }, [rowPick]);

  return (
    <div className="content-asistencias">
      <h1>Asistencia</h1>
      <hr />
      <div className="body-asistencia">
        <Clock getTime={setTimeCurrent} />
        <div className="container-mantine">
          {Loading ? (
            <LoaderSpiner />
          ) : infoPersonalSelected ? (
            <div className="personal-info">
              <div className="head-i">
                <h1>{infoPersonalSelected.name}</h1>
                <button
                  type="button"
                  onClick={() => {
                    setInfoPersonalSelected();
                  }}
                >
                  X
                </button>
              </div>
              <div className="list-personal">
                <MantineReactTable
                  columns={columns}
                  data={tableData}
                  initialState={{
                    density: "xs",
                    pagination: {},
                  }}
                  enableToolbarInternalActions={false}
                  enableColumnActions={false}
                  enableSorting={false}
                  enableTopToolbar={false}
                  enableExpandAll={false}
                  enablePagination={false}
                  enableBottomToolbar={false}
                  enableStickyHeader
                  mantineTableContainerProps={{
                    sx: {
                      // maxWidth: "300px",
                      maxHeight: "400px",
                    },
                  }}
                  mantineTableBodyRowProps={({ row }) => ({
                    onDoubleClick: () => {
                      console.log({
                        idPersonal: infoPersonalSelected._id,
                        infoDay: row.original,
                      });
                      setRowPick({
                        idPersonal: infoPersonalSelected._id,
                        infoDay: row.original,
                      });
                    },
                  })}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="action-personal">
                <button className="btn-add" type="button">
                  Agregar Personal
                </button>
              </div>
              <div className="list-card-asistencia">
                {listPersonal.map((per, index) => (
                  <button
                    type="buttom"
                    onClick={() => handleGetInfo(per._id)}
                    className="card-personal"
                    key={index}
                  >
                    <div className="title">
                      <h1>{per.name}</h1>
                    </div>
                    <div className="accion">
                      <img src={icoTime} alt="" />
                    </div>
                    <div className="body">
                      {
                        <div className="extra-info">
                          <div className="info-i">
                            <table className="info-table">
                              <tbody>
                                <tr>
                                  <td>Faltas :</td>
                                  <td>2</td>
                                </tr>
                                <tr>
                                  <td>Justificaciones :</td>
                                  <td>10</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {onChangeHorario && (
        <Portal
          onClose={() => {
            setChangeHorario(false);
          }}
        >
          <Maintenance onClose={handleCloseAction} info={rowPick} />
        </Portal>
      )}
    </div>
  );
};

export default Asistencia;
