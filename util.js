exports.randomCssColor = () => {
    const randomByte = () => Math.floor(Math.random() * 256);
    return `rgb(${randomByte()}, ${randomByte()}, ${randomByte()})`;
};