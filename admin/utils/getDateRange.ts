export default function getDateRange(option: 'day' | 'week' | 'month' | 'year' | 'range') {
    const today = new Date();
    let start_date = '';
    let end_date = '';

    switch (option) {
        case 'day':
            start_date = today.toISOString().split('T')[0];
            end_date = today.toISOString().split('T')[0];
            break;
        case 'week':
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            start_date = startOfWeek.toISOString().split('T')[0];
            end_date = endOfWeek.toISOString().split('T')[0];
            break;
        case 'month':
            start_date = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
            end_date = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
            break;
        case 'year':
            start_date = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
            end_date = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
            break;
        default:
            break;
    }

    return { start_date, end_date };
};