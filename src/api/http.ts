import { message } from "antd";
import axios from "axios";
import storage from "@/utils/storage";

message.config({
  maxCount: 1
});

const basHttp = axios.create({});

basHttp.interceptors.request.use(
  async function (config) {
    config.baseURL = "/api";
    // config.timeout = 3000
    config.headers.Authorization = getToken();

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

basHttp.interceptors.response.use(
  function (response) {
    switch (response.status) {
      case 200:
        if (response.data.code === 0) {
          return response.data;
        } else {
          message.error(response.data.message);
          return response.data;
        }
      case 401:
        message.warning("鉴权失败");
        break;
    }
  },
  function (error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.info("登陆过期，跳转至登陆页面！");
          window.location.href = "/login";
          localStorage.removeItem("asm-token");
          break;
        case 500:
          message.error(`服务器内部错误！${error.response.data.msg}`);
          break;
        default:
          message.error(error.response.data.message);
          break;
      }
    } else {
      switch (error.code) {
        case "ECONNABORTED":
          message.error("请求超时！");
          break;
        default:
          break;
      }
    }

    return Promise.reject(error);
  }
);

export const getToken = () => {
  const value = storage.getToken();
  if (!value) {
    return "";
  }
  if (new Date().getTime() > value.expiration) {
    return "";
  }
  return "Bearer " + value.token;
};

export default basHttp;
