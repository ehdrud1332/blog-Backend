
// value 사용자 입력
const isEmpty = value값 =>
    // ===는 비교
    // || 또는 && 그리고
    value === undefined ||
    value === null ||
    (typeof value === 'object' && object.keys(value).length === 0) ||
    (typeof value === 'string' && value,trim().length === 0);

module.exports = isEmpty;
