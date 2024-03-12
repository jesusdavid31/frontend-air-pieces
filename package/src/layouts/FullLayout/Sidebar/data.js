import EditIcon from '@mui/icons-material/Edit';
import ReportIcon from '@mui/icons-material/Assessment';
import SaleIcon from '@mui/icons-material/AttachMoney';

const AdminElements = [
  {
    title: "Manage Products",
    icon: EditIcon,
    href: "/dashboard/manage-products",
  },
  {
    title: "Manage Sales",
    icon: SaleIcon,
    href: "/dashboard/manage-sales",
  },
  {
    title: "Reports",
    icon: ReportIcon,
    href: "/dashboard/reports",
  },
];

const LogisticsOperatorElements = [
  {
    title: "Manage Products",
    icon: EditIcon,
    href: "/dashboard/manage-products",
  },
];

export {
  AdminElements,
  LogisticsOperatorElements
};
