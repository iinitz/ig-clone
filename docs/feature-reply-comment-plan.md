### Feature Plan: Reply to Comment

This feature will allow users to reply to existing comments on a post, creating a nested comment structure.

#### 1. Database Schema Update (Prisma)

*   **Goal:** Add a `parentId` field to the `Comment` model to establish a self-referencing relationship, indicating a comment is a reply to another comment.
*   **Action:** Modify `backend/prisma/schema.prisma` to add `parentId: Int? @map("parent_id")` and a self-referencing relation.
*   **Verification:** Run `npx prisma migrate dev --name add_comment_parent_id` to apply the schema changes to the PostgreSQL database.

#### 2. Backend API Changes

*   **Goal:** Update the comment creation endpoint to handle replies and modify the comment retrieval to include nested replies.
*   **Action:**
    *   **`backend/src/controllers/commentController.ts`:**
        *   Modify `createComment` to accept an optional `parentId` in the request body. If `parentId` is provided, create the comment as a reply.
        *   Modify `getCommentsByPost` to fetch comments and their nested replies. This will likely involve a recursive query or a specific Prisma include structure.
    *   **`backend/src/routes/comments.ts`:** Update Swagger documentation for the `createComment` endpoint to include the optional `parentId`.

#### 3. Frontend UI/UX Changes

*   **Goal:** Provide a way for users to reply to comments and display nested comments clearly.
*   **Action:**
    *   **`frontend/src/app/posts/[id]/page.tsx` (Single Post Page):**
        *   **Reply Button:** Add a "Reply" button next to each comment.
        *   **Reply Input:** When "Reply" is clicked, display a new input field (or modify the existing one) specifically for replying to that comment, possibly pre-filling the parent comment's author.
        *   **Display Nested Comments:** Implement a recursive rendering component or logic to display replies indented under their parent comments.
        *   **State Management:** Manage the state of which comment is being replied to.

#### 4. Testing

*   **Goal:** Ensure the new feature works as expected and doesn't introduce regressions.
*   **Action:**
    *   **Backend:** Write unit tests for the `createComment` and `getCommentsByPost` functions in `backend/src/controllers/commentController.ts` to cover reply creation and retrieval.
    *   **Frontend:** Manually test the reply functionality on the UI.
