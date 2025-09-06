<template>
    <div class="dropdown text-end" ref="dropdown" style="z-index: 1000;">
        <div class="select-box" @click="toggleDropdown">
            <span>
                Amer Amin
            </span>
            <img src="../../assets/arrow.svg" alt="arrow" class="arrow" />
        </div>
        <ul v-show="isOpen" class="dropdown-menu text-small shadow show" style="
        display: block;
        position: absolute;
        right: 1.5%;
        top: 9%;
        background-color: #ffffff;
        padding: 0;
        border: 1px solid #e1e9f0;
        border-radius: 6px;
        min-width: 250px;
      ">
            <li>
                <div class="profile-box">
                    <img :src="profileImage" alt="profile" width="70" height="70" class="rounded-circle mb-2" />
                    <div>
                        <strong>{{ name }}</strong><br />
                        <small class="text-muted">{{ email }}</small>
                    </div>
                    <Btn label="Edit Profile" @click.prevent="editProfile" />
                </div>
            </li>

            <li>
                <a class="dropdown-item" href="#" @click.prevent="switchAccount">
                    Switch account
                </a>
            </li>

            <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">
                    Log Out
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import SelectBtn from "./Select.vue";
import profilePic from "../../assets/user.svg";
import Btn from "./Button.vue";

export default {
    name: "UserDropdown",
    components: { SelectBtn, Btn },
    data() {
        return {
            isOpen: false,
            name: "Amer Amin",
            email: "ameramin08@gmail.com",
            profileImage: profilePic,
        };
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        editProfile() {
            alert("فتح صفحة تعديل الملف الشخصي");
        },
        switchAccount() {
            alert("تبديل الحساب");
        },
        logout() {
            alert("تم تسجيل الخروج");
        },
    },
};
</script>

<style scoped>
ul {
    list-style: none;
    margin: 0;
}

.profile-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 10px;
    padding: 10px 0;
}

a.dropdown-item {
    text-decoration: none;
    color: #21282e;
    font-size: 14px;
    border-top: 1px solid #e1e9f0;
    padding: 10px 20px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
}

.select-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    cursor: pointer;
}

.select-box span {
    flex: 1;
}

.arrow {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    position: static;
}
</style>
