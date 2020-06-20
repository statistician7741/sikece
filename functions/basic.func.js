module.exports = {
    getFormVar: (fields, state, isInit, vars_exclude) => {
        const data = {}
        fields.map(f => data[f[0]] = isInit ?
            (f[1] ? f[1] : undefined) :
            (state ?
                (state[f[0]]?state[f[0]]:f[1]) : undefined))
        
        if(vars_exclude){
            vars_exclude.forEach(field => {
                delete data[field]
            });
        }
        return data
    }
}