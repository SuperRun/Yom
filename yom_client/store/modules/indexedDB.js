const state = () => ({
    projects: []
});

const getters = {
    projects: state => state.projects
}

const mutations = {
    addProjToProjects: (state, project) => {state.projects.unshift(project);},
    setProjects: (state, projects) => (state.projects = projects),
    loadProjects: (state, projects) => (state.projects = state.projects.concat(projects))
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
