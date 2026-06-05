defmodule LocalCluster do
  defstruct [:peers, :edges, :nodes]

  def start(string) when is_binary(string) do
    start(parse_graph(string))
  end

  def start(edges) do
    nodes = edges_to_nodes(edges)

    peers =
      for node <- nodes do
        {node, start_peer(node)}
      end
      |> Enum.into(%{})

    local_cluster = %__MODULE__{
      nodes: nodes,
      edges: edges,
      peers: peers
    }

    mesh(local_cluster)

    local_cluster
  end

  def start_peer(node) do
    {:ok, pid, node2} =
      :peer.start(%{
        name: :"#{node}",
        connection: :standard_io,
        args: [~c"-connect_all", ~c"false"]
      })

    :peer.call(pid, :code, :add_pathsa, [:code.get_path()])
    %{name: node, node: node2, pid: pid}
  end

  def run_on(cluster, name, {m, f, a}) do
    :peer.call(cluster.peers[name].pid, m, f, a)
  end

  def mesh(%__MODULE__{peers: peers, edges: edges} = cluster) do
    for {n1, n2} <- unique_edges(edges) do
      run_on(cluster, n1, {:net_kernel, :connect_node, [peers[n2].node]})
    end
  end

  def sample() do
    """
    graph G {
      a -- b;
      b -- c;
      a -- c;
      b -- d;
      d -- e;
      e -- f;
      f -- d;
    }
    """
  end

  def parse_graph(graph) do
    graph
    |> String.split("\n")
    |> Enum.reduce([], fn line, out ->
      case Regex.run(~r/([^\s]+)\s*--\s*([^\s;]+);/, line) do
        nil -> out
        [_, n1, n2] -> [{:"#{n1}", :"#{n2}"} | out]
      end
    end)
  end

  def to_graph(cluster) do
    edges = unique_edges(cluster.edges)
    draw_edges(edges)
  end

  def draw_edges(edges) do
    """
    graph G {
      #{edges |> Enum.map_join("\n", fn {a, b} -> "#{a} -- #{b};" end)}
    }
    """
  end

  def edges_to_nodes(edges) do
    edges
    |> Enum.flat_map(fn {a, b} -> [a, b] end)
    |> Enum.uniq()
  end

  def unique_edges(edges) do
    edges
    |> Enum.map(fn {a, b} -> List.to_tuple(Enum.sort([a, b])) end)
    |> Enum.uniq()
  end

  def graph(%__MODULE__{peers: peers}) do
    Enum.flat_map(peers, fn {_node, peer} ->
      visible = :peer.call(peer.pid, :erlang, :nodes, [:visible])
      Enum.map(visible, fn n -> {peer.node, n} end)
    end)
    |> unique_edges
    |> draw_edges
  end
end
