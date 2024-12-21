

export default function handleTime(time: string) {
    const date = new Date(time);
    const timeNow = Date.now();

    const diffMilliseconds = timeNow - date.getTime();
    const diffSeconds = Math.floor(diffMilliseconds / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return `vừa xong`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
        });
    }
}