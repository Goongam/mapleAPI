const soapRequest = require("easy-soap-request");
const convert = require('xml-js');
const fs = require('fs');

let xml = 
`<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetInspectionInfo xmlns="https://api.maplestory.nexon.com/soap/" />
  </soap:Body>
</soap:Envelope>`;

const url = "http://api.maplestory.nexon.com/soap/maplestory.asmx?wsdl";


const sampleHeaders={
    'Content-Type': 'text/xml; charset=utf-8',
    'Content-Length': xml.length,
    'SOAPAction': "https://api.maplestory.nexon.com/soap/GetInspectionInfo"
};

const getData = async (callback)=>{
    try {
        // fs.writeFile('data.txt','vvv',(err)=>console.log(err))
        // console.log("read:"+fs.readFileSync('data.txt','utf8'))
        
        const {response} = await soapRequest({
            url:url,
            xml:xml,
            headers : sampleHeaders,
            timeout : 1000,
        });
        
        const {header, body, statusCode} = response;
        //console.log(body)
        
        var xmlToJson = convert.xml2json(body,{compact:true, sapces:4});
    
        callback(xmlToJson);
    } catch (error) {
        console.log(error);
    }
}

getData( (XML) => {
    const body = JSON.parse(XML);
    console.log("CHECK", body['soap:Envelope']['soap:Body'].GetInspectionInfoResponse.GetInspectionInfoResult['diffgr:diffgram'].NewDataSet);
});
