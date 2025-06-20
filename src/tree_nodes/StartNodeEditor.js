import { styleBtn, styleTable, styleDivBtn } from '../utils/style.js';
import { getTextByLocale } from '../utils/locale.js';
import { checkAllInputsStartNode, generateStrValueForStartNode, addRowStartNode } from './StartNodeConstructor.js';

// Окно редактирования начального узла
export var StartEditorWindow = function (cell, editorUi, x, y, w, h) {

    // Верстка окна
    var div = document.createElement('div');
    div.style.height = "100%";
    div.style.width = "100%";
    var table = document.createElement('table');
    table = styleTable(table);
    var tbody = document.createElement('tbody');
    tbody.style.height = "100%";

    fillDataStart(tbody, cell, editorUi);
    table.appendChild(tbody);
    div.appendChild(table);

    // Кнопка создания блока
    var applyBtn = mxUtils.button(getTextByLocale("Apply"), function () {

        checkAllInputsStartNode(table);

        let strValue = generateStrValueForStartNode(table);

        var theGraph = editorUi.editor.graph;

        theGraph.getModel().beginUpdate();
        cell.value.setAttribute("label", strValue);
        theGraph.getModel().endUpdate();
        theGraph.refresh(); // update the graph
        win.destroy();
    });

    // Кнопка добавления полей для нового класса
    var addClass = mxUtils.button(getTextByLocale("AddVariable"), function () {
        var newRow = addRowStartNode(editorUi);
        var tdDelRow = document.createElement('td');
        var btnDelRow = mxUtils.button(getTextByLocale("Delete"), function (evt) {
            evt.target.parentElement.parentElement.remove();
        });
        btnDelRow = styleBtn(btnDelRow);
        tdDelRow.appendChild(btnDelRow);
        newRow.appendChild(tdDelRow);
        table.appendChild(newRow);
    });


    // Добавление кнопок в окно
    var btnDiv = document.createElement('div');
    btnDiv = styleDivBtn(btnDiv);
    addClass = styleBtn(addClass);
    applyBtn = styleBtn(applyBtn);
    btnDiv.appendChild(addClass);
    btnDiv.appendChild(applyBtn);
    div.appendChild(btnDiv);

    // Настройки окна
    var win = new mxWindow(getTextByLocale("TitleStartEditorWindow"), div, x, y, w, h, true, true);
    this.window = win;
    this.window.destroyOnClose = true;
    this.window.setMaximizable(false);
    this.window.setResizable(true);
    this.window.setClosable(true);
    this.window.setVisible(true);
};

//Заполнение данными в окне
function fillDataStart(tbody, cell, editorUi) {
    let cellValue = cell.value;
    var cellLabel = cellValue.getAttribute('label');
    var values = cellLabel.split('\n');

    values.forEach((element, index) => {
        let varWithClass = element.split(" - ");

        var row = addRowStartNode(editorUi);

        row.getElementsByTagName("td").item(0)
            .getElementsByTagName("input").item(0).value = varWithClass[0];

        var typeSelect = row.getElementsByTagName("td").item(1)
            .getElementsByTagName("select").item(0);
        for (let index = 0; index < typeSelect.options.length; ++index) {
            if (typeSelect.options[index].value == varWithClass[1]) {
                typeSelect.options[index].selected = true;
            }
        }

        if (index != 0) {
            var tdDelRow = document.createElement('td');
            var btnDelRow = mxUtils.button(getTextByLocale("Delete"), function (evt) {
                evt.target.parentElement.parentElement.remove();
            });
            btnDelRow = styleBtn(btnDelRow);
            tdDelRow.appendChild(btnDelRow);
            row.appendChild(tdDelRow);
        }

        tbody.appendChild(row);
    });
}
