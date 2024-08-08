/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, MultiSelect } from "@mantine/core";
import { MantineReactTable } from "mantine-react-table";

import React, { useEffect, useMemo, useState } from "react";

import "./list.scss";

import {
  handleItemsCantidad,
  formatThousandsSeparator,
} from "../../../../../../utils/functions/index";

import { useDispatch, useSelector } from "react-redux";

import { documento } from "../../../../../../services/global";
import { GetOrdenServices_Preliminar } from "../../../../../../redux/actions/aOrdenServices";

const List = () => {
  //Filtros de Fecha
  const iDelivery = useSelector((state) => state.servicios.serviceDelivery);

  const { preliminary } = useSelector((state) => state.orden);
  const [onLoadingTable, setOnLoadingTable] = useState(false);

  const dispatch = useDispatch();

  // Informacion de Ordenes Preliminares Formateada
  const [ListOrdenes, setListOrdenes] = useState([]);

  const [rowPick, setRowPick] = useState();

  const columns = useMemo(
    () => [
      {
        accessorKey: "Recibo",
        header: "Orden",
        mantineFilterTextInputProps: {
          placeholder: "N°",
        },
        //enableEditing: false,
        size: 75,
      },

      {
        accessorKey: "Nombre",
        header: "Nombre",
        mantineFilterTextInputProps: {
          placeholder: "Cliente",
        },
        //enableSorting: false,
        size: 180,
      },
      {
        accessorKey: "FechaRecepcion",
        header: "Ingreso",
        mantineFilterTextInputProps: {
          placeholder: "Fecha",
        },
        size: 100,
      },
      {
        accessorKey: "items",
        header: "Items",
        mantineFilterTextInputProps: {
          placeholder: "Item",
        },
        Cell: ({ cell }) => (
          <MultiSelect
            data={cell.getValue()}
            value={cell.getValue()}
            readOnly
          />
        ),
        size: 250,
      },
      {
        accessorKey: "totalNeto",
        header: "Total",
        //enableSorting: false,
        Cell: ({ cell }) => (
          <Box>{formatThousandsSeparator(cell.getValue(), true)}</Box>
        ),
        enableEditing: false,
        mantineFilterTextInputProps: {
          placeholder: "Total",
        },
        size: 130,
      },
      {
        accessorKey: "Celular",
        header: "Celular",
        //enableSorting: false,
        mantineFilterTextInputProps: {
          placeholder: "Numero",
        },
        size: 100,
      },
      {
        accessorKey: "DNI",
        header: documento,
        //enableSorting: false,
        mantineFilterTextInputProps: {
          placeholder: documento,
        },
        size: 90,
      },
      {
        accessorKey: "attendedBy.name",
        header: "Cerrador",
        mantineFilterTextInputProps: {
          placeholder: "Cerrador",
        },
        //enableSorting: false,
        size: 180,
      },
    ],
    []
  );

  const getObjectIdTimestamp = (objectId) => {
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  };

  const handleGetFactura = async (info) => {
    const reOrdenar = [...info].sort((a, b) => {
      return getObjectIdTimestamp(b._id) - getObjectIdTimestamp(a._id);
    });

    const newData = await Promise.all(
      reOrdenar.map(async (d) => {
        const listItems = d.Items.filter(
          (item) => item.identificador !== iDelivery?._id
        );

        const structureData = {
          Id: d._id,
          Recibo: String(d.codRecibo).padStart(4, "0"),
          Nombre: d.Nombre,
          items: handleItemsCantidad(listItems),
          totalNeto: d.totalNeto,
          DNI: d.dni,
          Celular: d.celular,
          attendedBy: d.attendedBy,
          FechaRecepcion: d.dateRecepcion.fecha,
        };

        return structureData;
      })
    );

    setListOrdenes(newData);
  };

  useEffect(() => {
    if (preliminary.length === 0) {
      console.log("gaa");
      dispatch(GetOrdenServices_Preliminar());
    }
  }, []);

  useEffect(() => {
    handleGetFactura(preliminary);
  }, [preliminary]);

  return (
    <div className="list-pedidos">
      <h1>Lista : Ordenes de Recojo</h1>
      <MantineReactTable
        columns={columns}
        data={ListOrdenes}
        state={{ isLoading: onLoadingTable }}
        initialState={{
          showColumnFilters: true,
          density: "xs",
          sorting: [{ id: "Recibo", desc: true }],
          pagination: { pageSize: 5 },
        }}
        enableToolbarInternalActions={false}
        enableHiding={false}
        filterFns={{
          customFilterFn: (row, id, filterValue) => {
            return row.getValue(id) === filterValue;
          },
        }}
        localization={{
          filterCustomFilterFn: "Custom Filter Fn",
        }}
        enableColumnActions={false}
        enableSorting={false}
        enableTopToolbar={false}
        mantineTableProps={{
          highlightOnHover: false,
        }}
        mantineTableBodyCellProps={() => ({
          sx: {
            background: "transparent",
          },
        })}
        mantinePaginationProps={{
          showRowsPerPage: false,
        }}
        mantineTableBodyRowProps={({ row }) => ({
          onDoubleClick: () => setRowPick(row.original),
        })}
        enableStickyHeader={true}
        mantineTableContainerProps={{
          sx: {
            width: "100%",
            height: "100%",
            maxHeight: "calc(100% - 56px)",
            overflow: onLoadingTable ? "unset" : "auto",
            zIndex: "2",
          },
        }}
        enableRowVirtualization={true} // no scroll lateral
      />
    </div>
  );
};

export default List;
