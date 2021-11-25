export function formatDate(string) {
    let date = new Date(string)
    let strDate = null
    switch (date.getUTCMonth()) {
        case 0:
            strDate = 'Jan'
            break;
        case 1:
            strDate = 'Feb'
            break;
        case 2:
            strDate = 'Mar'
            break;
        case 3:
            strDate = 'Apr'
            break;
        case 4:
            strDate = 'May'
            break;
        case 5:
            strDate = 'Jun'
            break;
        case 6:
            strDate = 'Jul'
            break;
        case 7:
            strDate = 'Aug'
            break;
        case 8:
            strDate = 'Sep'
            break;
        case 9:
            strDate = 'Oct'
            break;
        case 10:
            strDate = 'Nov'
            break;
        case 11:
            strDate = 'Dec'
            break;
        default:
            strDate = null
    }
    strDate = strDate + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear()
    return strDate
}