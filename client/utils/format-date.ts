export const formatDate = (dateString: Date | undefined) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${date.getFullYear()}`;
    } catch {
        return 'Invalid Date';
    }
};
