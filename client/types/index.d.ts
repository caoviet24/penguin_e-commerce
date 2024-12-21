export interface ICourse {
    id: string;
    title: string;
    description: string;
    image: string;
    isPublished: boolean;
    number_access: number;
    number_lesson: number;
    level: number;
    createAt: string;
    updateAt: string;
}


export interface StatisticalData2 {
    total: number,
    rate: number,
}

export interface StatisticalData {
    day: string;
    num: number;
}

export interface ChartData {
    data: StatisticalData[];
    title: string;
    lable: string;
    lineColor: string;
    backgroundColor: string;
}

export interface CardData {
    total: number;
    rate: number;
    title: string;
    icon: JSX.Element;
}

export interface Account {
    acc_id: string;
    username: string;
    password: string;
    tick: boolean;
    role: string;
    isBan: boolean;
    createdAt: string;
    lastOnline: string;
}

export interface ResponseAccountData {
    data: Account[];
    total_record: number;
    page: number;
    limit: number;
}


export interface User{
    acc_id: string;
    full_name: string;
    nickname: string;
    avatar: string;
    bio: string;
}

export interface ResponseUserData {
    data: User[];
    total_record: number;
    page: number;
    limit: number;
}




export interface Post {
    post_id : string,
    title: string,
    image: string,
    num_likes: number,
    num_comments: number,
    location: string,
    createdAt: string,
    acc_id: string
}

export interface ResponsePostData {
    data: Post[];
    total_record: number;
    page: number;
    limit: number;
}


export interface Video {
    video_id : string,
    title: string,
    video: string,
    num_likes: number,
    num_comments: number,
    location: string,
    createdAt: string,
    acc_id: string
}

export interface ResponseVideoData {
    data: Video[];
    total_record: number;
    page: number;
    limit: number;
}
