Why This Schema Works (Quick Truth Rules)

1. Everything Is an Artifact

    - Documents, retros, notes, screenshots — no structural forks.

2. Asset ≠ Content
    They are intentionally decoupled
        - asset_policy handles storage

        - content_ref handles meaning


3. Metadata Is Layered

    - metadata → searchable, stable

    - metadata_ext → flexible, type-aware

    - custom → never blocks experimentation

4. Retro vs Note Is Solved

    - Same type (annotation), different metadata.intent

5. Directory Watch Safe

This schema does not assume:

    UI

    DB vendor

    Storage backend

    Sync model

