/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Modal, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../../../../models";
import List from "./List/List";
import Add from "./Add/Add";
import LoaderSpiner from "../../../../../components/LoaderSpinner/LoaderSpiner";

const Preliminar = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("");

  const [
    mAccionPreliminar,
    { open: openAccionPreliminar, close: closeAccionPreliminar },
  ] = useDisclosure(false);

  useEffect(() => {
    openAccionPreliminar();
  }, []);

  return (
    <div>
      {mode ? (
        <button type="button" onClick={openAccionPreliminar}>
          CAMBIAR
        </button>
      ) : null}
      {mode === "List" ? <List /> : mode === "Add" ? <Add /> : <LoaderSpiner />}
      <Modal
        opened={mAccionPreliminar}
        // closeOnClickOutside={false}
        // closeOnEscape={false}
        // withCloseButton={false}
        onClose={() => {
          closeAccionPreliminar();
          navigate(
            `/${PrivateRoutes.PRIVATE}/${PrivateRoutes.LIST_ORDER_SERVICE}`
          );
        }}
        size="auto"
        title=""
        scrollAreaComponent={ScrollArea.Autosize}
        centered
      >
        <Button
          type="button"
          color="green"
          onClick={() => {
            closeAccionPreliminar();
            setMode("List");
          }}
        >
          Lista de Ordenes de Recojo
        </Button>
        <Button
          type="button"
          color="blue"
          onClick={() => {
            closeAccionPreliminar();
            setMode("Add");
          }}
        >
          Registrar
        </Button>
        <Button
          type="button"
          color="red"
          onClick={() => {
            closeAccionPreliminar();
            console.log("EXPORTAR DATOS DE PRELIMINARES CANCELADOS");
          }}
        >
          EXCEL DE ANULADOS
        </Button>
      </Modal>
    </div>
  );
};

export default Preliminar;
