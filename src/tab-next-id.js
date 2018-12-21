
let lastTabId = 0;

function getNextTabId() {
    return ++lastTabId;
}   //  getNextTabId()

export { getNextTabId };
