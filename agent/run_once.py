from agent.email_inbox import unread_events
from agent.worker import handle
from agent.llm import call_llm


def main():
    for event in unread_events(limit=10):
        print(handle(event, call_llm))


if __name__ == "__main__":
    main()