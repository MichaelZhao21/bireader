export const getBiStyle = ({ fontWeight, opacity }) => `
.bi-bold b {
    font-weight: ${fontWeight} !important;
    opacity: ${opacity === 1 ? 'inherit' : opacity} !important;
}
`;
