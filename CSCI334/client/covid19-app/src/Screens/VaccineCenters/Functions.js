export const filterCenters = (e, setCenter, centerLength, centerFilter) => {
    let currentValue = e.target.value;
    const valLength = currentValue.length;

    const updateState = centerFilter.filter(c => {
        const postcode = c.postcode;
        const postcodeSub = postcode.substring(0, valLength);
        return postcodeSub === currentValue;
    });

    if(updateState.length !== centerLength) setCenter(updateState);
}