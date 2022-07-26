const soapRequest = require("easy-soap-request");
const convert = require('xml-js');
const fs = require('fs');
const oracledb = require('oracledb');

let connection;
async function connectDB(){
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    connection = await oracledb.getConnection({
    user          : "ljw",
    password      : "123123",
    connectString : "xe"
    });
}


async function insertData(id, nickname){
    try {
        
        const testre = await connection.execute("insert into MapleIdList values(:id, :nickname)",[id,nickname]);
        // const result = await connection.execute('select * from MapleIdList');
        connection.commit();
        console.log(`입력: ${id} / ${nickname}`);
    } catch (error) {
        console.log(error);
    }
}

async function insertError(id){
    try {
        await connection.execute("insert into ErrorIDList values(:id)",id);
        console.log("에러ID:",id);
    } catch (error) {
        console.log(error)
    }
}


const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


// let xml = 
// `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
// <soap:Body>
//   <GetCharacterInfoByAccountID xmlns="https://api.maplestory.nexon.com/soap/">
//     <AccountID>`+id+`</AccountID>
//   </GetCharacterInfoByAccountID>
// </soap:Body>
// </soap:Envelope>`;

const url = "http://api.maplestory.nexon.com/soap/maplestory.asmx?wsdl";




const getData = async (callback, id)=>{
    let xml = 
        `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <GetCharacterInfoByAccountID xmlns="https://api.maplestory.nexon.com/soap/">
                    <AccountID>`+id+`</AccountID>
                </GetCharacterInfoByAccountID>
            </soap:Body>
        </soap:Envelope>`;

    const sampleHeaders={
        'Content-Type': 'text/xml; charset=utf-8',
        'Content-Length': xml.length,
        'SOAPAction': "https://api.maplestory.nexon.com/soap/GetCharacterInfoByAccountID"
    };

    try {
        const {response} = await soapRequest({
            url:url,
            xml:xml,
            headers : sampleHeaders,
            timeout : 1000,
        });
        
        const {header, body, statusCode} = response;
        //console.log(body)
        
        var xmlToJson = convert.xml2json(body,{compact:true, sapces:4});
        callback(xmlToJson,id);
        
    } catch (error) {
        insertError(id);
    }
}

// getData( (XML) => {
//     const body = JSON.parse(XML);
//     //console.log("CHECK", body['soap:Envelope']['soap:Body'].GetInspectionInfoResponse.GetInspectionInfoResult['diffgr:diffgram'].NewDataSet);
//    console.log(body['soap:Body']);
// });

const print = async ()=>{
    for(id = 50001; id <= 52000; id++){
        getData( (XML, id) => {
            const body = JSON.parse(XML);
            const data = body['soap:Envelope']['soap:Body']['GetCharacterInfoByAccountIDResponse']['GetCharacterInfoByAccountIDResult']['diffgr:diffgram']['NewDataSet']['UserInfo'];
            // console.log(data);
            if(data['Lev']['_text'] != "0"){
                // console.log(data['CharacterName']['_text']);
                insertData(id, data['CharacterName']['_text']);
            }
        },id);
        await sleep(2);
    }
}


// getData( (XML) => {
//     const body = JSON.parse(XML);
//     const data = body['soap:Envelope']['soap:Body']['GetCharacterInfoByAccountIDResponse']['GetCharacterInfoByAccountIDResult']['diffgr:diffgram']['NewDataSet']['UserInfo'];
//     console.log(data)
// },10);




//  print();

connectDB();

print();