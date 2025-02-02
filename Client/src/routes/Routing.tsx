import { Route } from "react-router";

import Home from "../pages/Home/Home";
import Signin from "../pages/Signin/Signin";
import Signup from "../pages/Signup/Signup";
import Forget_password from "../pages/Forget Password/Forget_password";

import Basic_outlet from "../components/Outlet/Basic_outlet";
import Dashboard_outlet from "../components/Outlet/Dashboard_outlet";

import Basic_protection from "../Protection/Basic Protection/Basic_protection";
import Work_protection from "../Protection/Work Protection/Work_protection";
import Global_outlet from "../components/Outlet/Global_outlet";
import MissingRoute from "../components/MissingRoute";

const routing =
    <Route element={<Global_outlet />}>
        <Route element={<Basic_protection />}>
            <Route path="/" element={<Basic_outlet />}>
                <Route path="" element={<Signin />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forget_password" element={<Forget_password />} />
            </Route>
        </Route>

        <Route element={<Work_protection />}>
            <Route path="/dashboard" element={<Dashboard_outlet />}>
                <Route path="" element={<Home />} />
            </Route>
        </Route>

        <Route path="*" element={<MissingRoute />} />
    </Route>

export default routing;