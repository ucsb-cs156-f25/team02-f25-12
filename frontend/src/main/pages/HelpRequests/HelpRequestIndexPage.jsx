import React from "react";
import { useBackend } from "main/utils/useBackend";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";
import HelpRequestTable from "main/components/HelpRequests/HelpRequestTable";

// export default function HelpRequestIndexPage() {
//   const { data: currentUser } = useCurrentUser();

//   const {
//     data: helpRequests,
//     error: _error,
//     status: _status,
//   } = useBackend(
//     ["/api/helprequests/all"],
//     { method: "GET", url: "/api/helprequests/all" },
//     []
//   );

//   const showCreate = hasRole(currentUser, "ROLE_ADMIN");

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         {showCreate && (
//           <Button
//             variant="primary"
//             href="/helprequests/create"
//             style={{ float: "right" }}
//           >
//             Create HelpRequest
//           </Button>
//         )}
//         <h1>HelpRequests</h1>
//         <HelpRequestTable
//           requests={helpRequests ?? []}
//           currentUser={currentUser}
//         />
//       </div>
//     </BasicLayout>
//   );
// }

export default function HelpRequestIndexPage() {
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p>
          <a href="/placeholder/create">Create</a>
        </p>
        <p>
          <a href="/placeholder/edit/1">Edit</a>
        </p>
      </div>
    </BasicLayout>
  );
}