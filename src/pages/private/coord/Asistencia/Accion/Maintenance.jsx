/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ValidIco from "../../../../../components/ValidIco/ValidIco";
import { Radio, Group } from "@mantine/core";
import TimePicker from "react-time-picker";
import * as Yup from "yup";
import { modals } from "@mantine/modals";

import {
  Button,
  MultiSelect,
  NumberInput,
  Select,
  Switch,
  Text,
  Textarea,
} from "@mantine/core";

import "./maintenance.scss";
import moment from "moment";

// eslint-disable-next-line react/prop-types
const Maintenance = ({ info, onClose }) => {
  const { infoDay } = info;
  const [day, setDay] = useState();
  const dispatch = useDispatch();

  const rol = "admin";
  const lTipoRegistro = ["normal", "cumpleaños", "feriado", "falta"];

  const validationSchema = Yup.object().shape({
    fecha: Yup.string().required("Campo obligatorio"),
    // ingreso: Yup.string().required("Campo obligatorio"),
    // salida: Yup.string().required("Campo obligatorio"),
    tipoRegistro: Yup.string().required("Campo obligatorio"),
  });

  const formik = useFormik({
    initialValues: {
      fecha: infoDay?.fecha,
      ingreso: infoDay?.ingreso,
      observacion: infoDay?.observacion,
      salida: infoDay?.salida,
      time: infoDay?.time,
      tipoRegistro: infoDay?.tipoRegistro || "normal",
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleAddPromocion = (data) =>
    modals.openConfirmModal({
      title: "Registro de Promocion",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de agregar esta nueva Promocion ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        // dispatch(addPromocion(data));
        formik.resetForm();
        onClose();
      },
    });

  const handleUpdatePromocion = (data) =>
    modals.openConfirmModal({
      title: "Actualizacion de Promocion",
      centered: true,
      children: (
        <Text size="sm">¿ Estas seguro de actulizar esta Promocion ?</Text>
      ),
      labels: { confirm: "Si", cancel: "No" },
      confirmProps: { color: "green" },
      //onCancel: () => console.log("Cancelado"),
      onConfirm: () => {
        // dispatch(updatePromocion({ infoPromo: data, id: info._id }));
        formik.resetForm();
        onClose();
      },
    });

  const handleGetDay = (date) => {
    console.log(date);
    const formattedDayOfWeek = moment(date, "YYYY-MM-DD").format("dddd");
    return formattedDayOfWeek;
  };

  useEffect(() => {
    if (info) {
      console.log(info);
      const iDay = handleGetDay(info?.infoDay.fecha);
      setDay(iDay);
    }
  }, [info]);

  return (
    <form onSubmit={formik.handleSubmit} className="action-asistencia">
      <h1>{day}</h1>
      <div className="input-item">
        <Radio.Group
          name="tipoRegistro"
          onChange={(value) => {
            formik.setFieldValue("tipoRegistro", value);
          }}
          value={formik.values.tipoRegistro}
          label="Tipo de Registro"
        >
          <Group mt="xs">
            {lTipoRegistro.map((tp, index) => (
              <Radio key={index} value={tp} label={tp} />
            ))}
          </Group>
        </Radio.Group>
        {formik.errors.prenda &&
          formik.touched.prenda &&
          ValidIco(formik.errors.prenda)}
      </div>
      <div className="content-hour">
        <label htmlFor="">Hora Ingreso :</label>
        <div className="date-dh">
          <TimePicker
            className="hour-date"
            onChange={(newTime) => {
              const timeMoment = moment(newTime, "HH:mm");
              const timeString = timeMoment.format("HH:mm");
              formik.setFieldValue("ingreso.hora", timeString);
            }}
            value={
              moment(formik.values.ingreso?.hora, "HH:mm").isValid()
                ? moment(formik.values.ingreso?.hora, "HH:mm").toDate()
                : null
            }
            disabled={
              formik.values.salida?.saved && rol !== "admin" ? true : false
            }
            amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
            clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
            clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
            disableClock={true}
            format="h:mm a"
          />
          {!formik.values.ingreso.saved ? (
            <button
              className="day-date"
              disabled={!formik.values.ingreso.hora}
              type="button"
            >
              guardar
            </button>
          ) : rol === "admin" ? (
            <button className="day-date" type="button">
              editar
            </button>
          ) : null}
        </div>
      </div>
      <div className="content-hour">
        <label htmlFor="">Hora Salida :</label>
        <div className="date-dh">
          <TimePicker
            className="hour-date"
            onChange={(newTime) => {
              const timeMoment = moment(newTime, "HH:mm");
              const timeString = timeMoment.format("HH:mm");
              formik.setFieldValue("salida.hora", timeString);
            }}
            value={
              moment(formik.values.salida?.hora, "HH:mm").isValid()
                ? moment(formik.values.salida?.hora, "HH:mm").toDate()
                : null
            }
            disabled={
              formik.values.salida?.saved && rol !== "admin" ? true : false
            }
            amPmAriaLabel="Select AM/PM" // Aquí debe ir una cadena descriptiva
            clockIcon={null} // Esto oculta el icono del reloj, si lo deseas
            clearIcon={null} // Esto oculta el icono de limpieza, si lo deseas
            disableClock={true}
            format="h:mm a"
          />
          {!formik.values.salida.saved ? (
            <button
              className="day-date"
              disabled={!formik.values.salida.hora}
              onClick={() => {
                formik.setFieldValue("salida.saved", true);
              }}
              type="button"
            >
              guardar
            </button>
          ) : rol === "admin" ? (
            <button className="day-date" type="button">
              editar
            </button>
          ) : null}
          <button className="day-date" type="button">
            X
          </button>
        </div>
      </div>
      <div className="body-ct">
        {/* <div className="input-item">
          <NumberInput
            name="descuento"
            label="Porcentaje de Descuento :"
            value={formik.values.descuento}
            placeholder="Ingrese Porcentaje de Descuento"
            precision={2}
            max={100}
            min={0}
            step={10}
            hideControls
            autoComplete="off"
            onChange={(e) => {
              formik.setFieldValue("descuento", e);
            }}
          />
          {formik.errors.descuento &&
            formik.touched.descuento &&
            ValidIco(formik.errors.descuento)}
        </div> */}
        <div className="input-item">
          <Textarea
            name="Observaciones"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            placeholder="Redacte las observaciones necesarias ..."
            label="Observacion"
          />
          {formik.errors.descripcion &&
            formik.touched.descripcion &&
            ValidIco(formik.errors.descripcion)}
        </div>
      </div>
      <Button type="submit" className="btn-save" color="orange">
        Actualizar Promocion
      </Button>
    </form>
  );
};

export default Maintenance;
