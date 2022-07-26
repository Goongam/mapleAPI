const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function connection(){
    try {
        connection = await oracledb.getConnection({
            user          : "ljw",
            password      : "123123",
            connectString : "xe"
        });
        const testre = await connection.execute("insert into MapleIdList values(:id, :nickname)",[1,"test"]);
        const result = await connection.execute('select * from MapleIdList');
        connection.commit();
        console.log("result:",result);
    } catch (error) {
        console.log(error);
    }
}

connection();