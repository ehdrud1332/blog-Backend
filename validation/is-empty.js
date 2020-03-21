
// value 사용자 입력값
const isEmpty = value =>
    // ===는 비교
    // || 또는 && 그리고
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;
