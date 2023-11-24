const toConnection = (root, totalCount) => (connection, edge) => {
    connection.nodes.push(edge.node);
    connection.edges.push({ ...edge, root });
    connection.totalCount = totalCount;
    return connection;
  };
  export default toConnection