const viewRepository = require('../repositories/view.repository');
const postService = require('./post.service');
const groupService = require('./group.service');
const userService = require('./user.service');
const {buildValidatedUpdateData} = require('../utils/settingsValidator');

const getHomePageData = async (userId) => {
    const posts = await postService.getFeedPostsForUser(userId);
    return { posts };
};

const getHistoryEvents = async () => {
    const HISTORY_EVENTS_LIMIT = 5;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    let historyEvents = [];
    try {
        const historyRes = await fetch('https://history.muffinlabs.com/date', {
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (historyRes.ok) {
            const historyData = await historyRes.json();
            historyEvents = historyData?.data?.Events?.slice(0, HISTORY_EVENTS_LIMIT) || [];
        }
    } catch (historyErr) {
        console.warn('Failed to fetch history events:', historyErr.name === 'AbortError' ? 'Request timed out' : historyErr.message);
    }

    return historyEvents;
};

const getGroupPageData = async (groupId, userId) => {
    const group = await groupService.getGroupById(groupId);
    const members = await groupService.getGroupMembers(groupId);
    const posts = await postService.getPostsByGroupId(groupId);
    const postCount = await postService.countPostsInGroupByMembers(groupId);

    const isMember = members.some(member => member._id.toString() === userId);

    return {
        group,
        members,
        posts,
        postCount,
        isMember
    };
};

const getProfilePageData = async (userId, viewerId) => {
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const posts = await postService.getMyPosts(userId);
    const postCount = await postService.countPostsByUser(userId);

    return {
        user,
        posts,
        postCount
    };
};

const updateUserSettings = async (userId, body, file) => {
    const updateFields = buildValidatedUpdateData(body, file);
    return await viewRepository.updateUserById(userId, updateFields);
};

module.exports = {
    getHomePageData,
    getHistoryEvents,
    getGroupPageData,
    getProfilePageData,
    updateUserSettings
};
