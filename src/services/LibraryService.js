import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://extendedcollection.com/wp-json/wp/v2/",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getItems(perPage, page) {
    const axiosParams = () => {
      const fields = ["id", "link", "title", "date", "acf", "featured_media", "categories", "tags"];
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("per_page", perPage);
      params.append("_embed", true);
      params.append("_fields", fields);
      return params;
    };
    return apiClient.get("/library?", {
      params: axiosParams()
    });
  },
  getItemImage(id) {
    return apiClient.get(`media/${id}`);
  }
};
