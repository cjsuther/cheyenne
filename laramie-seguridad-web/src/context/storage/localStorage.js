
const LocalStorage = {
    get: function(name) {
        return localStorage.getItem(name);
    },
    getObj: function (name) {
        let str = this.get(name);
        return JSON.parse(str);
    },
    set: function (name, value) {
        localStorage.setItem(name, value);
    },
    setObj: function (name, value) {
        let str = JSON.stringify(value);
        this.set(name, str);
    },
    del: function (name) {
        localStorage.removeItem(name);
    }
};

export default LocalStorage;