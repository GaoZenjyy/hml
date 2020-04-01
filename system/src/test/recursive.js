export default {
  methods: {
    getRecursive(role, arr) {
      if (!role.children) {
        return arr.push(role.id);
      }
      role.children.forEach(item => this.getRecursive(item, arr));
    }
  }
};
