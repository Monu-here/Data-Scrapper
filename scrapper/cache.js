const md5 = require("md5");
const fs = require('fs');

const cache = [];
const pushCache = (data) => {
    cache.push(data);
}


const inCache = (url) => {
    const encrypted = md5(url);
    return cache.includes(encrypted);
}


const appendToFile = (data, filePath) => {
    fs.open(filePath, 'a', (err, fd) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File doesn't exist, create a new one
                fs.writeFile(filePath, data, (err) => {
                    if (err) {
                        console.error('Error:', err);
                        throw err;
                    }
                    console.log('File created and data appended successfully.');
                });
            } else {
                console.error('Error:', err);
                throw err;
            }
        } else {
            // File exists, append data to it
            fs.appendFile(fd, data, (err) => {
                if (err) {
                    console.error('Error:', err);
                    throw err;
                }
                console.log('Data appended to file successfully.');
            });
        }
    });
}





const saveCache = (vars) => {
    // pushCache(vars);
    let md5s = [];
    let md5Text = "";

    vars.forEach((data) => {
        const encrypted = md5(data.url);
        if (!cache.includes(encrypted)) {
            md5s.push(encrypted);
            md5Text += encrypted + "\n";
            pushCache(encrypted);
        }
    });

    appendToFile(md5Text, '.cache');
};

const loadCache = () => {
    try {
        const data = fs.readFileSync('.cache', 'utf8');
        data.split("\n").forEach((encrypted) => {
            if (encrypted != "") {
                pushCache(encrypted);
            }
        });
        console.log('Cache loaded');
    } catch (err) {
        console.error('Error:', err);
    }
}

loadCache();

module.exports = {
    cache, saveCache, inCache

}