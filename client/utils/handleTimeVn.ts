

export default function handleTimeVn(time: Date | string) {
    const date = new Date(time);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}