/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator } from "react-tabulator";
import "./diseñobase.scss";

const List = () => {
  const data = [
    {
      id: 1,
      name: "John Doe",
      progress: 50,
      gender: "Male",
      rating: 5,
      col: "red",
      dob: "01/01/2000",
      car: true,
    },
    {
      id: 2,
      name: "Jane Doe",
      progress: 80,
      gender: "Female",
      rating: 3,
      col: "blue",
      dob: "02/02/1999",
      car: false,
    },
  ];

  const columns = [
    {
      title: "Name",
      field: "name",
      width: 200,
      headerFilter: "input",
      hozAlign: "left",
    },
    { title: "Progress", field: "progress", width: 100, hozAlign: "left" },
    { title: "Gender", field: "gender", width: 100, hozAlign: "left" },
    { title: "Rating", field: "rating", width: 100, hozAlign: "left" },
    { title: "Favourite Color", field: "col", width: 200, hozAlign: "left" },
    { title: "Date Of Birth", field: "dob", width: 100, hozAlign: "left" },
    { title: "Driver", field: "car", width: 200, hozAlign: "left" },
  ];

  var minMaxFilterEditor = function (
    cell,
    onRendered,
    success,
    cancel,
    editorParams
  ) {
    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues() {
      success({
        start: start.value,
        end: end.value,
      });
    }

    function keypress(e) {
      if (e.keyCode == 13) {
        buildValues();
      }

      if (e.keyCode == 27) {
        cancel();
      }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);

    container.appendChild(start);
    container.appendChild(end);

    return container;
  };

  //custom max min filter function
  function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams) {
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

    if (rowValue) {
      if (headerValue.start != "") {
        if (headerValue.end != "") {
          return rowValue >= headerValue.start && rowValue <= headerValue.end;
        } else {
          return rowValue >= headerValue.start;
        }
      } else {
        if (headerValue.end != "") {
          return rowValue <= headerValue.end;
        }
      }
    }

    return true; //must return a boolean, true if it passes the filter.
  }

  return (
    <div className="table-list">
      <ReactTabulator
        data={data}
        columns={columns}
        height={"max-content"}
        // width={"max-content"}
        options={{
          layout: "fitDataFill",
          responsiveLayout: "collapse",
          tooltips: true,
          tooltipsHeader: true,
          tooltipsColumn: true,
          rowFormatter: function (row) {
            //Establecer fondo de fila de forma alternada
            if (row.getData().id % 2 === 0) {
              row.getElement().style.backgroundColor = "#f9f9f9";
            } else {
              row.getElement().style.backgroundColor = "#ffffff";
            }
          },
        }}
      />
    </div>
  );
};

export default List;
