module.exports = {
    timer: async (cb) => {
        const s = Date.now()
        const res = await cb()
        const diff = Date.now() - s
        return {
            ms: diff,
            res
        }
    },
}