export function paginate(page: string = "1", limit: string = "10") {
    let pageInt = parseInt(page);
    let limitInt = parseInt(limit);

    let skipInt: number = (pageInt - 1) * limitInt;

    return { pageInt, limitInt, skipInt }
}