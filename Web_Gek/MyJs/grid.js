

//全局变量
var ControlUrl1 = "api/Resourse/"
var ControlUrl2 = "api/Ppo/"
var currentTime = getNowFormatDate();
var currentDate = getNowDate();
var taskDatasourse = null;
var ppoDataAll = [];
var ppoData = [];
var processDataAll = [];
var processData=[];
var processFormatDataAll = null;
var processFormatData = new kendo.data.DataSource();
var colorList = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red',
				'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
				'gray', 'gray', 'gray', 'gray', 'gray', 'gray', 'gray', 'gray', 'gray', 'gray',
				'pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink']




function onChange1(arg) {
    //使processFormatData清空
    processData=[];
    for (var i = 0; i < processFormatData.data().length;) {
        processFormatData.remove(processFormatData.at(0));
    };
    var b = this.selectedKeyNames().length;
    //console.log(b);
    var selectList = this.selectedKeyNames();
    //console.log(selectList);
    selectList.sort(sortNumber);
    for (var i = 0; i < b; i++) {
        var j = selectList[i];
        var temp = processDataAll[j-1];
        processFormatData.add(processFormatDataAll[j-1]);
        processData.push(temp);
    }
    var scheduler = $("#scheduler").data("kendoScheduler");
    scheduler.view(scheduler.viewName());
    //console.log(processData);
};
function onChange2(arg) {
    ppoData = [];
    var c = this.selectedKeyNames().length;
    var selectList = this.selectedKeyNames();
    selectList.sort(sortNumber);
    //console.log(selectList);
    for (var i = 0; i < c; i++) {
        var j = selectList[i];
        var temp = ppoDataAll[j - 1];
        ppoData.push(temp);
    }
   // console.log(ppoData);
};
function fninit() {
    $.ajax({
        type: "get",
        url: ControlUrl1 + "GETRESOURSEDATA",
        success: function (data, status) {
            var argumentList = ["process", "type"];
            data = trimdata(data, argumentList);
            processDataAll = data;
            processFormatDataAll = fnTranslateData(data, colorList);
            $("#grid1").kendoGrid({
                dataSource: {
                    data: data,
                    schema: {
                        model: {
                            id: "processID"
                        }
                    }
                },
                scrollable: true,
                persistSelection: true,
                sortable: true,
                height: 450,
                change: onChange1,
                columns: [
                    { selectable: true, width: "12%" },
                    { field: "process", title: "Process", width: "20%" },
                    { field: "type", title: "Type", width: "35%" },
                    { field: "capacity", title: "Capacity(ton/m)" }]
            });
        }
    });
    $.ajax({
        type: "get",
        url: ControlUrl2 + "GETPPODATA",
        success: function (data, status) {
            //var argumentList = ["process", "type"];
           // data = trimdata(data, argumentList);
            ppoDataAll = data;
            $("#grid2").kendoGrid({
                dataSource: {
                    data: data,
                    schema: {
                        model: {
                            id: "ppo_id"
                        }
                    }
                },
                scrollable: true,
                persistSelection: true,
                sortable: true,
                height: 450,
                change:onChange2,
                columns: [
                    { selectable: true, width: "3%" },
                    { field: "ppo_no", title: "ppo_no", width: "11%" },
                    { field: "type", title: "type", width: "4%" },
                    { field: "customer", title: "customer" },
                    { field: "receive_Date", title: "receive_date", format: "{0:yyyy-MM-dd HH:mm:ss}", width: "12%" },
                    { field: "produce_del_Date", title: "produce_del_date", width: "12%" },
                    { field: "operation", title: "operation", width: "35%" },
                    { field: "weight", title: "weight", width: "8%" }]
            });
        }
    })
    $("#scheduler").kendoScheduler({
        date: new Date("2017/9/7 00:00 AM"),
        //startTime: new Date(currentTime),
        eventHeight: 100,
        majorTick: 200,
       // currentTimeMarker: true,
        height: 700,
        views: [
            "timeline",
            "timelineWeek",
            "timelineWorkWeek",
            //{
            //    type: "timelineMonth",
            //    startTime: new Date(currentTime),
            //    majorTick: 300
            //}
        ],
        dataSource: {
            data: taskDatasourse,
            schema: {
                model: {
                    id: "EventID",
                    fields: {
                        eventID: { from: "EventID", type: "number" },
                        title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                        start: { type: "date", from: "Start" },
                        end: { type: "date", from: "End" },
                        description: { from: "Description" },
                        processID: { from: "processID", nullable: true },
                    }
                }
            }
        },
        group: {
            resources: ["process"],
            orientation: "vertical"
        },
        resources: [
            {
                field: "processID",
                name: "process",
                dataSource: processFormatData,
                multiple: true,
                title: "process"
            }
        ]
    });
}


function onBtn1Clicked() {
        var scheduler = $("#scheduler").data("kendoScheduler");
        scheduler.view(scheduler.viewName());
}

function onBtn2Clicked() {
    //console.log(processData);
    //a = { "name": "heliangbo", "age": 32 };
    //console.log(processData[0].process);
    //console.log(typeof (a));
    //console.log(typeof (processData));
    //console.log(typeof (processData[0]));
    var jsonData = JSON.stringify(processData);
    var jsonppoData = JSON.stringify(ppoData);
    console.log(jsonData);
    console.log(jsonppoData);
    var url1 = "http://localhost:8090/GEKPlanningSys/ServletConnection"
    $.ajax({
        type: "post",
        url: url1,
        data: jsonData+"  "+jsonppoData,
        dataType:"json",
        success: function (data, status) {
            alert(data);
            alert(status);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
        } 
    })
}


//以下为依赖功能函数
function getNowDate() {
    var date = new Date();
    var seperator1 = "/";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + "0" + seperator2 + "00 AM";
    return currentdate;
}
function fnTranslateData(data, colorlist) {
    var processData = [];
    for (var i = 0; i < data.length; i++) {
        processData.push({ text: '', value: '', color: '' });
        processData[i].text = data[i].type;
        processData[i].value = i + 1;
        processData[i].color = colorlist[i];
    }
    return processData;
}
function sortNumber(a, b) {
    return a - b
}
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function trimdata(data,argumentList) {
    var datalen = data.length;
    var amlen = argumentList.length;
    for(i=0;i<datalen;i++){
        for (j = 0; j < amlen; j++) {
            data[i][argumentList[j]] = trim(data[i][argumentList[j]]);
        }
    }
    return data;
}