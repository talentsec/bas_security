import React from "react";
import AppContent from "@/components/AppContent";
const My = React.lazy(() => import("@/pages/my"));
const MyVector = React.lazy(() => import("@/pages/my/vector/index"));
const MyVectorDetail = React.lazy(() => import("@/pages/my/vector/detail"));
const MyVectorEdit = React.lazy(() => import("@/pages/my/vector/edit/index"));
const MyScenario = React.lazy(() => import("@/pages/my/scenarios/index"));
const MyScenarioDetail = React.lazy(() => import("@/pages/my/scenarios/detail"));
const MyScenarioEdit = React.lazy(() => import("@/pages/my/scenarios/edit/index"));
const MyTemplate = React.lazy(() => import("@/pages/my/template/index"));
const MyTemplateEdit = React.lazy(() => import("@/pages/my/template/edit"));
const MyTemplateDetail = React.lazy(() => import("@/pages/my/template/detail"));
const AllTemplate = React.lazy(() => import("@/pages/all/template/"));
const AllScenario = React.lazy(() => import("@/pages/all/scenarios"));
const AllScenarioDetail = React.lazy(() => import("@/pages/all/scenarios/detail"));
const AllVector = React.lazy(() => import("@/pages/all/vector"));
const AllVectorDetail = React.lazy(() => import("@/pages/all/vector/detail"));
const AllTemplateDetail = React.lazy(() => import("@/pages/all/template/detail"));

const All = React.lazy(() => import("@/pages/all/index"));

export const protectedRoutes = [
  {
    path: "/app",
    element: <AppContent />,
    children: [
      {
        path: "my",
        element: <My />,
        children: [
          {
            path: "vector",
            element: <MyVector />
          },
          {
            path: "vector/edit",
            element: <MyVectorEdit />
          },
          {
            path: "vector/:id",
            element: <MyVectorDetail />
          },
          {
            path: "scenario",
            element: <MyScenario />
          },
          {
            path: "scenario/:id",
            element: <MyScenarioDetail />
          },
          {
            path: "scenario/edit",
            element: <MyScenarioEdit />
          },
          {
            path: "template",
            element: <MyTemplate />
          },
          {
            path: "template/edit",
            element: <MyTemplateEdit />
          },
          {
            path: "template/:id",
            element: <MyTemplateDetail />
          }
        ]
      },
      {
        path: "all",
        element: <All />,
        children: [
          {
            path: "vector",
            element: <AllVector />
          },
          {
            path: "vector/:id",
            element: <AllVectorDetail />
          },
          {
            path: "scenario",
            element: <AllScenario />
          },
          {
            path: "scenario/:id",
            element: <AllScenarioDetail />
          },
          {
            path: "template",
            element: <AllTemplate />
          },
          {
            path: "template/:id",
            element: <AllTemplateDetail />
          }
        ]
      }
    ]
  }
];
