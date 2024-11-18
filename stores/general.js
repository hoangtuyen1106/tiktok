import { defineStore } from "pinia"
import axios from "~/plugins/axios"

const $axios = axios().provide.axios

export const useGeneralStore = defineStore('general', {
    state: () => ({
        isLoginOpen: false,
        isEditProfileOpen: false,
        selectedPost: null,
        ids: null,
        isBackUrl: "/",
        posts: null,
        suggested: null,
        following: null,
    }),
    actions: {
        bodySwitch(val) {
            if(val) {
                document.body.style.overflow = 'hidden'
                return
            }
            document.body.style.overflow = 'visible'
        },

        allLowerCaseNoCaps(str) {
            return str.split(' ').join('').toLowerCase()
        },

        setBackUrl(url) {
            this.isBackUrl = url
        },

        async hasSessionExpired() {
            await $axios.interceptors.response.use((response) => {
                //call was successful, continue
                return response;
            }, (error) => {
                switch(error.response.status) {
                    case 401: //Not Logged in
                    case 419: //session expired
                    case 503:  //down for maintenance
                        useUserStore().resetUser()
                        window.location.href = '/';
                        break;
                    case 500:
                        alert('Oops, something went wrong! The team has been notified.');
                        break;
                    default:
                        //allow individual requests to handle ohter errors
                        return Promise.reject(error);
                }
            })
        },

        async getPostById(id) {
            let res = await $axios.get(`/api/posts/${id}`)

            this.$state.selectedPost = res.data.post[0]
            this.$state.ids = res.data.ids
        },

        async getRandomUsers(type) {
            let res = await $axios.get(`/api/get-random-users`)
            if(type === 'suggested') {
                this.suggested = res.data.suggested
            }

            if(type === 'following') {
                this.following = res.data.following
            }
        },

        updateSideMenuImage(array, user) {
            for (let i = 0; i < array.length; i++) {
                const res = array[i];
                if(res.id == user.id) {
                    res.image = user.image
                }
            }
        },
        async getAllUsersAndPosts() {
            let res = await $axios.get('/api/home')
            this.posts = res.data
        }
    },
    persist: true
})