from typing import TypedDict

from langgraph.graph import StateGraph, START, END

from services.groq_service import analyze_deviation


class DeviationState(TypedDict):
    text: str
    result: dict


def extract_and_analyze(state: DeviationState):

    result = analyze_deviation(state["text"])

    return {
        "result": result
    }


def build_deviation_graph():

    graph = StateGraph(DeviationState)

    graph.add_node(
        "analyze_deviation",
        extract_and_analyze
    )

    graph.add_edge(
        START,
        "analyze_deviation"
    )

    graph.add_edge(
        "analyze_deviation",
        END
    )

    return graph.compile()


deviation_graph = build_deviation_graph()