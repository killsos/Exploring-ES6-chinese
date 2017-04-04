function selectEntries({ start=0, end=-1, step=1 } = {}) { // (A)
    console.log(start,end,step);
}

selectEntries({ start: 10, end: 30, step: 2 }); // 10 30 2

selectEntries({ step: 3 }); // 0 -1 3

selectEntries({}); // 0 -1 1
selectEntries();   // 0 -1 1
