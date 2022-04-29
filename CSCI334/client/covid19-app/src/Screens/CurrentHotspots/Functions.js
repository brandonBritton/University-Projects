export const filterHotspots = (e, setHotspots, hotspotsLength, hotspotsFilter) => {
    let currentValue = e.target.value;
    const valLength = currentValue.length;

    const updateState = hotspotsFilter.filter(hotspot => {
        const postcode = hotspot.postcode;
        const postcodeSub = postcode.substring(0, valLength);
        return postcodeSub === currentValue;
    });

    if(updateState.length !== hotspotsLength) setHotspots(updateState);
}