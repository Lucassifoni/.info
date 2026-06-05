defmodule ActualProbe do
  def run_probe(binary) do
    traverse(node(), MapSet.new(), binary)
  end

  def run_probe(binary, visited) do
    traverse(node(), visited, binary)
  end

  def traverse(my_node, visited_nodes, binary) do
    :erlang.group_leader(:erlang.whereis(:init), self())
    visible_neighbors = :erlang.nodes()
    initial = {Map.put(%{}, my_node, visible_neighbors), MapSet.put(visited_nodes, my_node)}

    {adjacent, _} =
      Enum.reduce(visible_neighbors, initial, fn neighbor, {adj, visited} ->
        if MapSet.member?(visited, neighbor) do
          {adj, visited}
        else
          subgraph = visit(neighbor, visited, binary)
          {Map.merge(adj, subgraph), MapSet.union(visited, MapSet.new(Map.keys(subgraph)))}
        end
      end)

    adjacent
  end

  def visit(node, visited_nodes, binary) do
    :erpc.call(node, :code, :load_binary, [__MODULE__, ~c"actual_probe.module", binary])
    :erpc.call(node, __MODULE__, :run_probe, [binary, visited_nodes])
  end

  def self_code() do
    {_, bin, _} = :code.get_object_code(ActualProbe)
    bin
  end
end
