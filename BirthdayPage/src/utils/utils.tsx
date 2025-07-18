

export const getNextValidBirthday = (birthday: Date): Date => {
    const now = new Date();
    let nextBirthday = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());

    while (nextBirthday < now) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    return nextBirthday;
}