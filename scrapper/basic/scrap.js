const { default: axios } = require("axios");
const { public_path } = require("../helper");
const fs = require('fs');
const { saveCache } = require("../cache");

class Scrap {
    URL = "";
    name = "";
    async getData() {

        const res = await axios.get(this.URL);
        return res.data;
    }

    loadData() {

    }

    
    async save(data,_name) {
        if(_name==null){
            _name=this.name;
        }

        // console.log(data.length);

        // for (let index = 0; index < data.length; index++) {
        //     const _data = data[index];
        //     await axios.post("http://127.0.0.1:8000/api/add",_data);
        //     try {
                
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
        saveCache(data);
    
        const path = public_path + "/json";
        // fs.mkdirSync(path, { recursive: true });
        const jsonData = JSON.stringify(data, null, 4);
        const filePath = path + "/" + _name + ".json";
        fs.writeFileSync(filePath, jsonData);

    }
}

module.exports = Scrap;