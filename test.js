const soapRequest = require("easy-soap-request");
const convert = require('xml-js');
const fs = require('fs');

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
        console.log("ErrorID:"+id);
        //console.log(error);
    }
}

// getData( (XML) => {
//     const body = JSON.parse(XML);
//     //console.log("CHECK", body['soap:Envelope']['soap:Body'].GetInspectionInfoResponse.GetInspectionInfoResult['diffgr:diffgram'].NewDataSet);
//    console.log(body['soap:Body']);
// });

const print = async ()=>{
    for(id = 2000000; id <= 5000000; id++){
        getData( (XML, id) => {
            const body = JSON.parse(XML);
            const data = body['soap:Envelope']['soap:Body']['GetCharacterInfoByAccountIDResponse']['GetCharacterInfoByAccountIDResult']['diffgr:diffgram']['NewDataSet']['UserInfo'];
            if(data['Lev']['_text'] != "0"){
                if(data['CharacterName']['_text'] == "맛있는바지")
                {
                    console.log("ID="+id);
                    console.log(data['CharacterName']);
                    console.log("\n");
                }
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



 const sleep = (ms) => {
     return new Promise(resolve=>{
         setTimeout(resolve,ms)
     })
 }

 print();