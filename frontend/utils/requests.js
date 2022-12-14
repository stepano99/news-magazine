const BASE_URL = 'http://localhost:3000/api/feed';

const requests = {
    fetchEvents: `${BASE_URL}/category/events`,
    fetchPolitics: `${BASE_URL}/category/politics`,
    fetchSport: `${BASE_URL}/category/sport`,
    fetchNews: `${BASE_URL}/category/news`,
    fetchLatest: `${BASE_URL}/articles/latest`,
    fetchImage: `${BASE_URL}/image/`,
    fetchOneArticle : `${BASE_URL}/`,
}

export default requests;