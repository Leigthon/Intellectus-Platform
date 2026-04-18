import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Cake,
  Camera,
  CheckCircle2,
  Mail,
  FileText,
  GraduationCap,
  HeartHandshake,
  MapPin,
  Pencil,
  School,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT_EMAIL } from "@/pages/Marketplace";
import { supabase } from "@/lib/supabase";

const LS_KEY = "intellectus_profiles";
const MAX_IMAGE_SIZE_BYTES = 1024 * 1024 * 2;
const MAX_TRANSCRIPT_SIZE_BYTES = 1024 * 1024 * 3;

// ---------------------------------------------------------------------------
// localStorage helpers (fallback when Supabase is unavailable)
// ---------------------------------------------------------------------------
function lsGetProfiles() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function lsSaveProfile(profile) {
  const profiles = lsGetProfiles();
  const idx = profiles.findIndex((p) => p.id === profile.id);
  if (idx > -1) {
    profiles[idx] = profile;
  } else {
    profiles.unshift(profile);
  }
  localStorage.setItem(LS_KEY, JSON.stringify(profiles));
  return profile;
}

function lsDeleteProfile(id) {
  const profiles = lsGetProfiles().filter((p) => p.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(profiles));
}

// ---------------------------------------------------------------------------
// Data access — Supabase with localStorage fallback
// ---------------------------------------------------------------------------
async function fetchProfiles() {
  if (supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    // Map snake_case DB columns back to camelCase used in the UI
    return (data || []).map(dbRowToProfile);
  }
  return lsGetProfiles();
}

async function saveProfile(profile) {
  if (supabase) {
    const row = profileToDbRow(profile);
    const { error } = await supabase.from("profiles").upsert(row);
    if (error) throw new Error(error.message);
    return profile;
  }
  return lsSaveProfile(profile);
}

async function deleteProfile(id) {
  if (supabase) {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  lsDeleteProfile(id);
}

// ---------------------------------------------------------------------------
// Column mapping between JS camelCase and Supabase snake_case
// ---------------------------------------------------------------------------
function profileToDbRow(p) {
  return {
    id: p.id,
    student_type: p.studentType,
    display_name: p.displayName,
    student_email: p.studentEmail,
    age: p.age,
    study_level: p.studyLevel,
    high_school_grade: p.highSchoolGrade,
    institution_name: p.institutionName,
    field_of_study: p.fieldOfStudy,
    city: p.city,
    bio: p.bio,
    profile_image_data_url: p.profileImageDataUrl,
    transcript_data_url: p.transcriptDataUrl,
    transcript_name: p.transcriptName,
    needs: p.needs,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

function dbRowToProfile(row) {
  return {
    id: row.id,
    studentType: row.student_type,
    displayName: row.display_name,
    studentEmail: row.student_email,
    age: row.age,
    studyLevel: row.study_level,
    highSchoolGrade: row.high_school_grade,
    institutionName: row.institution_name,
    fieldOfStudy: row.field_of_study,
    city: row.city,
    bio: row.bio,
    profileImageDataUrl: row.profile_image_data_url,
    transcriptDataUrl: row.transcript_data_url,
    transcriptName: row.transcript_name,
    needs: row.needs,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function newProfileId() {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseOptionalAge(value) {
  const n = Number.parseInt(String(value).trim(), 10);
  if (Number.isNaN(n)) return null;
  if (n < 10 || n > 99) return null;
  return n;
}

function profileMatchesFunderSearch(profile, filters) {
  const nameQ = filters.name.trim().toLowerCase();
  if (nameQ && !(profile.displayName || "").toLowerCase().includes(nameQ)) {
    return false;
  }

  const ageQ = parseOptionalAge(filters.age);
  if (ageQ != null) {
    const profileAge =
      typeof profile.age === "number" && Number.isFinite(profile.age)
        ? profile.age
        : null;
    if (profileAge !== ageQ) return false;
  }

  const subj = filters.subject.trim().toLowerCase();
  if (subj && !(profile.fieldOfStudy || "").toLowerCase().includes(subj)) {
    return false;
  }

  const school = filters.school.trim().toLowerCase();
  if (school && !(profile.institutionName || "").toLowerCase().includes(school)) {
    return false;
  }

  const loc = filters.location.trim().toLowerCase();
  if (loc && !(profile.city || "").toLowerCase().includes(loc)) {
    return false;
  }

  return true;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

const STUDY_LEVELS = [
  "High school",
  "1st year university",
  "2nd year university",
  "3rd year university",
  "Honours / 4th year",
  "Postgraduate",
  "Other",
];
const HIGH_SCHOOL_GRADES = [
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fundingMailto = (profile, supportLabel) => {
  const subject = encodeURIComponent(
    `Intellectus Funding — ${supportLabel} for ${profile.displayName} (${profile.id})`
  );
  const needs = Array.isArray(profile.needs) ? profile.needs.join(", ") : "";
  const body = encodeURIComponent(
    `Hi Intellectus,\n\nI'd like to fund a student through Intellectus Funding.\n\n` +
      `Support type: ${supportLabel}\n` +
      `Student display name: ${profile.displayName}\n` +
      `Student email: ${profile.studentEmail || "Not provided"}\n` +
      `Profile ID: ${profile.id}\n` +
      `Study level: ${profile.studyLevel}\n` +
      `Age: ${typeof profile.age === "number" ? profile.age : "Not provided"}\n` +
      `Focus area: ${profile.fieldOfStudy}\n` +
      `City / region: ${profile.city}\n` +
      `Their stated needs: ${needs}\n\n` +
      `Profile image uploaded: ${profile.profileImageDataUrl ? "Yes" : "No"}\n` +
      `Transcript uploaded: ${profile.transcriptName ? profile.transcriptName : "No"}\n\n` +
      `About their goals:\n${profile.bio}\n\n` +
      `Please confirm eligibility and next steps.\n`
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};

const Funding = () => {
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState("");
  const [formSaved, setFormSaved] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [manageEmail, setManageEmail] = useState("");
  const [funderSearch, setFunderSearch] = useState({
    name: "",
    age: "",
    subject: "",
    school: "",
    location: "",
  });
  const [profileToView, setProfileToView] = useState(null);
  const [form, setForm] = useState({
    studentType: "highschool",
    displayName: "",
    studentEmail: "",
    age: "",
    studyLevel: STUDY_LEVELS[1],
    highSchoolGrade: HIGH_SCHOOL_GRADES[0],
    institutionName: "",
    fieldOfStudy: "",
    city: "",
    bio: "",
    profileImageDataUrl: "",
    transcriptDataUrl: "",
    transcriptName: "",
    needTutoring: true,
    needTextbooks: false,
  });

  useEffect(() => {
    setProfilesLoading(true);
    fetchProfiles()
      .then((data) => {
        setProfiles(data);
        setProfilesError("");
      })
      .catch(() => setProfilesError("Could not load profiles."))
      .finally(() => setProfilesLoading(false));
  }, []);

  const needsList = useMemo(() => {
    const n = [];
    if (form.needTutoring) n.push("Tutoring sessions");
    if (form.needTextbooks) n.push("Textbooks");
    return n;
  }, [form.needTutoring, form.needTextbooks]);

  const parsedFormAge = useMemo(() => {
    const t = form.age.trim();
    if (!t) return null;
    return parseOptionalAge(t);
  }, [form.age]);

  const ageFieldInvalid = useMemo(() => {
    const t = form.age.trim();
    if (!t) return false;
    return parsedFormAge == null;
  }, [form.age, parsedFormAge]);

  const canSubmitProfile = useMemo(() => {
    const email = form.studentEmail.trim().toLowerCase();
    return (
      form.displayName.trim().length >= 2 &&
      EMAIL_REGEX.test(email) &&
      form.institutionName.trim().length >= 2 &&
      form.fieldOfStudy.trim().length >= 2 &&
      form.city.trim().length >= 2 &&
      form.bio.trim().length >= 40 &&
      needsList.length > 0 &&
      !ageFieldInvalid
    );
  }, [form, needsList.length, ageFieldInvalid]);

  const filteredProfiles = useMemo(
    () => profiles.filter((p) => profileMatchesFunderSearch(p, funderSearch)),
    [profiles, funderSearch]
  );

  const hasActiveFunderSearch = useMemo(
    () =>
      funderSearch.name.trim() !== "" ||
      funderSearch.age.trim() !== "" ||
      funderSearch.subject.trim() !== "" ||
      funderSearch.school.trim() !== "" ||
      funderSearch.location.trim() !== "",
    [funderSearch]
  );

  const onChange = useCallback((key) => {
    return (e) => {
      const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [key]: v }));
    };
  }, []);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Profile image must be an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFormError("Profile image is too large. Use an image under 2MB.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormError("");
      setForm((f) => ({ ...f, profileImageDataUrl: dataUrl }));
    } catch {
      setFormError("Could not read the selected profile image.");
    }
  };

  const onTranscriptChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_TRANSCRIPT_SIZE_BYTES) {
      setFormError("Transcript file is too large. Use a file under 3MB.");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormError("");
      setForm((f) => ({
        ...f,
        transcriptDataUrl: dataUrl,
        transcriptName: file.name,
      }));
    } catch {
      setFormError("Could not read the selected transcript.");
    }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    if (!canSubmitProfile) return;
    const normalizedEmail = form.studentEmail.trim().toLowerCase();
    const existingByEmail = profiles.some(
      (p) => p.studentEmail === normalizedEmail && p.id !== editingProfileId
    );
    if (existingByEmail) {
      setFormError(
        "A profile with this email already exists. Use that email below the cards to edit or remove it."
      );
      return;
    }
    const profile = {
      id: editingProfileId || newProfileId(),
      studentType: form.studentType,
      displayName: form.displayName.trim(),
      studentEmail: normalizedEmail,
      age: parseOptionalAge(form.age),
      studyLevel: form.studyLevel,
      highSchoolGrade: form.studentType === "highschool" ? form.highSchoolGrade : "",
      institutionName: form.institutionName.trim(),
      fieldOfStudy: form.fieldOfStudy.trim(),
      city: form.city.trim(),
      bio: form.bio.trim(),
      profileImageDataUrl: form.profileImageDataUrl,
      transcriptDataUrl: form.transcriptDataUrl,
      transcriptName: form.transcriptName,
      needs: needsList,
      createdAt:
        profiles.find((p) => p.id === editingProfileId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveProfile(profile);
      setProfiles((prev) =>
        editingProfileId
          ? prev.map((p) => (p.id === editingProfileId ? profile : p))
          : [profile, ...prev]
      );
      setFormSaved(true);
      setFormError("");
      setEditingProfileId(null);
      setForm({
        studentType: "highschool",
        displayName: "",
        studentEmail: "",
        age: "",
        studyLevel: STUDY_LEVELS[1],
        highSchoolGrade: HIGH_SCHOOL_GRADES[0],
        institutionName: "",
        fieldOfStudy: "",
        city: "",
        bio: "",
        profileImageDataUrl: "",
        transcriptDataUrl: "",
        transcriptName: "",
        needTutoring: true,
        needTextbooks: false,
      });
      window.setTimeout(() => setFormSaved(false), 5000);
      const el = document.getElementById("browse-profiles");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setFormError("Could not save your profile. Please try again.");
    }
  };

  const startEditProfile = useCallback(
    (profile) => {
      setEditingProfileId(profile.id);
      setFormError("");
      setForm({
        studentType: profile.studentType || "tertiary",
        displayName: profile.displayName || "",
        studentEmail: profile.studentEmail || "",
        age:
          typeof profile.age === "number" && Number.isFinite(profile.age)
            ? String(profile.age)
            : "",
        studyLevel: profile.studyLevel || STUDY_LEVELS[1],
        highSchoolGrade: profile.highSchoolGrade || HIGH_SCHOOL_GRADES[0],
        institutionName: profile.institutionName || "",
        fieldOfStudy: profile.fieldOfStudy || "",
        city: profile.city || "",
        bio: profile.bio || "",
        profileImageDataUrl: profile.profileImageDataUrl || "",
        transcriptDataUrl: profile.transcriptDataUrl || "",
        transcriptName: profile.transcriptName || "",
        needTutoring: profile.needs?.some((n) => n.includes("Tutoring")) || false,
        needTextbooks: profile.needs?.some((n) => n.includes("Textbook")) || false,
      });
      scrollToSection("student-profile");
    },
    [scrollToSection]
  );

  const removeProfile = useCallback(async (id) => {
    try {
      await deleteProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (editingProfileId === id) {
        setEditingProfileId(null);
      }
    } catch {
      // silently ignore — the UI hasn't changed so the user can retry
    }
  }, [editingProfileId]);

  useEffect(() => {
    if (!profileToView) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setProfileToView(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileToView]);

  return (
    <div className="min-h-screen bg-white pt-16">
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-rose-100 bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
              Intellectus Funding
            </p>
            <h1 className="mt-3 text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Fund learning. Get funded.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600">
              Funders sponsor tutoring sessions and textbooks. Students publish a short
              profile so sponsors can discover who they are and what they need—then
              Intellectus helps match and fulfil support safely.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                onClick={() => scrollToSection("student-profile")}
                className="group rounded-full bg-gradient-to-r from-rose-500 via-rose-500 to-orange-500 px-7 py-2.5 text-base font-semibold text-white shadow-lg shadow-rose-300/40 hover:from-rose-600 hover:to-orange-600"
              >
                <GraduationCap className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                I&apos;m a student
              </Button>
              <Button
                type="button"
                onClick={() => scrollToSection("browse-profiles")}
                variant="outline"
                className="group rounded-full border-amber-300 bg-white/95 px-7 py-2.5 text-base font-semibold text-amber-900 shadow-lg shadow-amber-200/40 hover:bg-amber-50"
              >
                <HeartHandshake className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                I&apos;m a funder
              </Button>
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
              >
                Browse textbooks
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-slate-100 bg-slate-50/80 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Built for students and funders
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
              One place to request support and one place to discover learners you can back—
              with Intellectus coordinating tutoring and marketplace textbooks.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <Card className="border-rose-100 shadow-sm">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                    <GraduationCap className="h-6 w-6" aria-hidden />
                  </div>
                  <CardTitle className="text-xl">Students</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-600">
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Create a public profile: your level, field, city, and goals.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Flag whether you need tutoring sessions, textbooks, or both.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Funders browse profiles and start funding through Intellectus.
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-amber-100 shadow-sm">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <HeartHandshake className="h-6 w-6" aria-hidden />
                  </div>
                  <CardTitle className="text-xl">Funders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-600">
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Review student profiles and stated needs.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Choose to fund tutoring blocks or textbook allowances (or both).
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Email Intellectus with one click—we guide settlement and reporting.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Student profile form */}
        <section id="student-profile" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 text-rose-700">
              <Sparkles className="h-5 w-5" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-widest">Students</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Create your funding profile</h2>
            <p className="mt-2 text-slate-600">
              Fill in the form below to publish your profile so funders can discover you
              and reach out via Intellectus.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              High school and university students can both apply for funding support.
            </p>

            {formSaved && (
              <div
                className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                role="status"
              >
                Profile published. Scroll down to see it in the directory—funders can use
                the buttons on your card to start an enquiry.
              </div>
            )}
            {formError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {formError}
              </div>
            )}

            <Card className="mt-8 border-slate-200 shadow-md">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={submitProfile} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-800" htmlFor="profile-image">
                        Profile image
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <label
                          htmlFor="profile-image"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Camera className="h-4 w-4" />
                          Upload image
                        </label>
                        {form.profileImageDataUrl && (
                          <img
                            src={form.profileImageDataUrl}
                            alt="Selected profile"
                            className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                          />
                        )}
                      </div>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={onProfileImageChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-800" htmlFor="transcript-file">
                        Academic transcript
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <label
                          htmlFor="transcript-file"
                          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <FileText className="h-4 w-4" />
                          Upload transcript
                        </label>
                        {form.transcriptName && (
                          <span className="max-w-[180px] truncate text-xs text-slate-600">
                            {form.transcriptName}
                          </span>
                        )}
                      </div>
                      <input
                        id="transcript-file"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.webp"
                        onChange={onTranscriptChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-800" htmlFor="student-type">
                      Student category
                    </label>
                    <select
                      id="student-type"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                      value={form.studentType}
                      onChange={onChange("studentType")}
                    >
                      <option value="highschool">High school student</option>
                      <option value="tertiary">University / college student</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-800" htmlFor="fn">
                      Display name
                    </label>
                    <input
                      id="fn"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                      value={form.displayName}
                      onChange={onChange("displayName")}
                      placeholder="e.g. Alex M."
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-800" htmlFor="student-email">
                      Student email (used to edit/remove your profile)
                    </label>
                    <input
                      id="student-email"
                      type="email"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                      value={form.studentEmail}
                      onChange={onChange("studentEmail")}
                      placeholder="e.g. learner@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-800" htmlFor="student-age">
                      Age (optional)
                    </label>
                    <input
                      id="student-age"
                      type="number"
                      inputMode="numeric"
                      min={10}
                      max={99}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2 sm:max-w-xs"
                      value={form.age}
                      onChange={onChange("age")}
                      placeholder="e.g. 17 — helps funders find you"
                    />
                    {ageFieldInvalid && (
                      <p className="mt-1 text-xs text-rose-600">
                        Enter a whole number between 10 and 99, or leave blank.
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-semibold text-slate-800" htmlFor="lvl">
                        Study level
                      </label>
                      <select
                        id="lvl"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                        value={form.studyLevel}
                        onChange={onChange("studyLevel")}
                      >
                        {STUDY_LEVELS.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.studentType === "highschool" && (
                      <div>
                        <label className="text-sm font-semibold text-slate-800" htmlFor="grade">
                          High school grade
                        </label>
                        <select
                          id="grade"
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                          value={form.highSchoolGrade}
                          onChange={onChange("highSchoolGrade")}
                        >
                          {HIGH_SCHOOL_GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-slate-800" htmlFor="field">
                        {form.studentType === "highschool"
                          ? "Main subjects / goals"
                          : "Field / course focus"}
                      </label>
                      <input
                        id="field"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                        value={form.fieldOfStudy}
                        onChange={onChange("fieldOfStudy")}
                        placeholder={
                          form.studentType === "highschool"
                            ? "e.g. Maths, Physical Sciences, English"
                            : "e.g. Mechanical engineering"
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-800" htmlFor="institution">
                      {form.studentType === "highschool"
                        ? "School name"
                        : "University / college name"}
                    </label>
                    <input
                      id="institution"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                      value={form.institutionName}
                      onChange={onChange("institutionName")}
                      placeholder={
                        form.studentType === "highschool"
                          ? "e.g. Cape Town High School"
                          : "e.g. University of Cape Town"
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-800" htmlFor="city">
                      City or region
                    </label>
                    <input
                      id="city"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                      value={form.city}
                      onChange={onChange("city")}
                      placeholder="e.g. Cape Town"
                    />
                  </div>
                  <fieldset>
                    <legend className="text-sm font-semibold text-slate-800">
                      What do you need funded?
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-4">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={form.needTutoring}
                          onChange={onChange("needTutoring")}
                          className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        Tutoring sessions
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={form.needTextbooks}
                          onChange={onChange("needTextbooks")}
                          className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        Textbooks
                      </label>
                    </div>
                  </fieldset>
                  <div>
                    <label className="text-sm font-semibold text-slate-800" htmlFor="bio">
                      Goals & context (at least 40 characters)
                    </label>
                    <textarea
                      id="bio"
                      rows={5}
                      className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                      value={form.bio}
                      onChange={onChange("bio")}
                      placeholder="Share what you are studying, what you are trying to achieve this term, and how funding would help—without sharing passwords or banking details."
                    />
                    <p className="mt-1 text-xs text-slate-500">{form.bio.trim().length}/40 min</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={!canSubmitProfile}
                    className="w-full rounded-full bg-rose-500 py-6 text-base font-semibold text-white hover:bg-rose-600 sm:w-auto"
                  >
                    {editingProfileId ? "Save profile changes" : "Publish profile"}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Button>
                  {editingProfileId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingProfileId(null);
                        setFormError("");
                        setForm({
                          studentType: "highschool",
                          displayName: "",
                          studentEmail: "",
                          age: "",
                          studyLevel: STUDY_LEVELS[1],
                          highSchoolGrade: HIGH_SCHOOL_GRADES[0],
                          institutionName: "",
                          fieldOfStudy: "",
                          city: "",
                          bio: "",
                          profileImageDataUrl: "",
                          transcriptDataUrl: "",
                          transcriptName: "",
                          needTutoring: true,
                          needTextbooks: false,
                        });
                      }}
                      className="w-full rounded-full sm:w-auto"
                    >
                      Cancel editing
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Funder browse */}
        <section
          id="browse-profiles"
          className="scroll-mt-24 border-t border-slate-100 bg-gradient-to-b from-white to-slate-50 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-2 text-amber-800">
              <Users className="h-5 w-5" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-widest">Funders</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Browse student profiles</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              When you are ready to fund, use a button below—your email app opens with the
              student summary pre-filled to{" "}
              <span className="font-mono text-sm text-slate-800">{CONTACT_EMAIL}</span>.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <label className="text-sm font-semibold text-slate-800" htmlFor="manage-email">
                Students: enter your profile email to edit or remove your card
              </label>
              <input
                id="manage-email"
                type="email"
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none ring-rose-300 focus:ring-2"
                value={manageEmail}
                onChange={(e) => setManageEmail(e.target.value)}
                placeholder="same email used when profile was created"
              />
            </div>

            {profilesLoading ? (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                <p className="font-medium text-slate-700">Loading profiles…</p>
              </div>
            ) : profilesError ? (
              <div className="mt-10 rounded-2xl border border-dashed border-rose-200 bg-rose-50 p-12 text-center text-rose-700">
                <p className="font-medium">{profilesError}</p>
              </div>
            ) : profiles.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                <p className="font-medium text-slate-700">No profiles yet</p>
                <p className="mt-2 text-sm">
                  Students can publish a profile using the form above. Profiles appear here
                  for all visitors once saved.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
                  <div className="relative border-b border-slate-100 bg-gradient-to-br from-rose-50 via-white to-amber-50/40 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-12 h-36 w-36 rounded-full bg-amber-200/25 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30">
                          <Search className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                            Find students
                          </h3>
                          <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">
                            Search by display name, or narrow by age, subject, school, or place.
                            Only profiles that match every field you fill in are shown.
                          </p>
                        </div>
                      </div>
                      {hasActiveFunderSearch && (
                        <button
                          type="button"
                          onClick={() =>
                            setFunderSearch({
                              name: "",
                              age: "",
                              subject: "",
                              school: "",
                              location: "",
                            })
                          }
                          className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-900"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50/40 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-rose-200/60 hover:shadow-md sm:p-5">
                      <label
                        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                        htmlFor="filter-name"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                          <UserRound className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        Display name
                      </label>
                      <input
                        id="filter-name"
                        type="search"
                        className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200"
                        value={funderSearch.name}
                        onChange={(e) =>
                          setFunderSearch((s) => ({ ...s, name: e.target.value }))
                        }
                        placeholder="First name, initials, or any part of their public name"
                        autoComplete="off"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-rose-200/60 hover:shadow-md">
                        <label
                          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          htmlFor="filter-age"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                            <Cake className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          Age
                        </label>
                        <input
                          id="filter-age"
                          type="number"
                          inputMode="numeric"
                          min={10}
                          max={99}
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200"
                          value={funderSearch.age}
                          onChange={(e) =>
                            setFunderSearch((s) => ({ ...s, age: e.target.value }))
                          }
                          placeholder="Exact age, e.g. 17"
                        />
                        <p className="mt-2 text-[11px] leading-snug text-slate-500">
                          Only matches students who saved an age.
                        </p>
                      </div>
                      <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-rose-200/60 hover:shadow-md">
                        <label
                          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          htmlFor="filter-subject"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                            <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          Subject / focus
                        </label>
                        <input
                          id="filter-subject"
                          type="search"
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200"
                          value={funderSearch.subject}
                          onChange={(e) =>
                            setFunderSearch((s) => ({ ...s, subject: e.target.value }))
                          }
                          placeholder="Maths, engineering…"
                        />
                      </div>
                      <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-rose-200/60 hover:shadow-md">
                        <label
                          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          htmlFor="filter-school"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                            <School className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          School
                        </label>
                        <input
                          id="filter-school"
                          type="search"
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200"
                          value={funderSearch.school}
                          onChange={(e) =>
                            setFunderSearch((s) => ({ ...s, school: e.target.value }))
                          }
                          placeholder="Part of institution name"
                        />
                      </div>
                      <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-rose-200/60 hover:shadow-md">
                        <label
                          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                          htmlFor="filter-location"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                            <MapPin className="h-3.5 w-3.5" aria-hidden />
                          </span>
                          Location
                        </label>
                        <input
                          id="filter-location"
                          type="search"
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:ring-2 focus:ring-rose-200"
                          value={funderSearch.location}
                          onChange={(e) =>
                            setFunderSearch((s) => ({ ...s, location: e.target.value }))
                          }
                          placeholder="City or region"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {filteredProfiles.length === 0 ? (
                  <div className="mt-10 rounded-2xl border border-dashed border-amber-200 bg-white p-10 text-center text-slate-600">
                    <p className="font-medium text-slate-800">No profiles match your search</p>
                    <p className="mt-2 text-sm text-slate-500">
                      Try a different display name or other keywords, or clear filters to see
                      everyone again. Age matches only when the student listed their age.
                    </p>
                  </div>
                ) : (
              <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                {filteredProfiles.map((p) => (
                  <li key={p.id}>
                    <Card className="h-full border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="mb-2 flex items-center gap-3">
                          {p.profileImageDataUrl ? (
                            <img
                              src={p.profileImageDataUrl}
                              alt={`${p.displayName} profile`}
                              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-sm font-bold text-rose-700">
                              {p.displayName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          {p.transcriptName && (
                            <a
                              href={p.transcriptDataUrl}
                              download={p.transcriptName}
                              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              Transcript
                            </a>
                          )}
                        </div>
                        <CardTitle className="text-lg text-slate-900">{p.displayName}</CardTitle>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          {p.studyLevel} · {p.city}
                          {typeof p.age === "number" ? ` · Age ${p.age}` : ""}
                        </p>
                        {p.studentType === "highschool" && p.highSchoolGrade ? (
                          <p className="text-xs font-medium uppercase tracking-wide text-rose-600">
                            {p.highSchoolGrade}
                          </p>
                        ) : null}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-xs font-medium text-slate-500">
                          {p.studentType === "highschool" ? "School" : "Institution"}:{" "}
                          <span className="text-slate-700">{p.institutionName}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          <Mail className="mr-1 inline h-3.5 w-3.5" aria-hidden />
                          {p.studentEmail}
                        </p>
                        <p className="text-sm font-medium text-rose-800">{p.fieldOfStudy}</p>
                        <p className="line-clamp-4 text-sm leading-relaxed text-slate-600">{p.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {p.needs?.map((n) => (
                            <span
                              key={n}
                              className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400">Profile ID: {p.id}</p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setProfileToView(p)}
                            className="rounded-full border-slate-300 px-4 py-2 text-sm"
                          >
                            <UserRound className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                            View full profile
                          </Button>
                          {p.needs?.some((n) => n.includes("Tutoring")) && (
                            <Button
                              href={fundingMailto(p, "Tutoring sessions")}
                              className="rounded-full bg-rose-500 px-4 py-2 text-sm text-white hover:bg-rose-600"
                            >
                              Fund tutoring
                            </Button>
                          )}
                          {p.needs?.some((n) => n.includes("Textbook")) && (
                            <Button
                              href={fundingMailto(p, "Textbooks")}
                              variant="outline"
                              className="rounded-full border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-50"
                            >
                              Fund textbooks
                            </Button>
                          )}
                          {manageEmail.trim().toLowerCase() === p.studentEmail && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => startEditProfile(p)}
                                className="rounded-full border-slate-300 px-4 py-2 text-sm"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeProfile(p.id)}
                                className="rounded-full border-rose-300 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
                )}
              </>
            )}
          </div>
        </section>

        {/* Sponsorship types */}
        <section className="border-t border-slate-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-slate-900">What funders can cover</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <GraduationCap className="h-5 w-5 text-rose-600" aria-hidden />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">Tutoring sessions</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Pre-paid blocks of one-to-one or small-group tutoring through Intellectus
                  Academy—aligned to the student&apos;s modules and exam calendar.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <BookOpen className="h-5 w-5 text-amber-700" aria-hidden />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">Textbooks</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Credits or bundles linked to the Intellectus Marketplace so students can buy
                  second-hand titles at fair prices from peers.
                </p>
                <Link
                  to="/marketplace"
                  className="mt-3 inline-flex text-sm font-semibold text-rose-700 underline-offset-4 hover:underline"
                >
                  Open marketplace
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-rose-100 bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Questions about sponsoring?</h2>
          <p className="mx-auto mt-2 max-w-xl text-rose-100">
            Tell us whether you are an individual, family trust, or company—we&apos;ll explain
            options, tax documentation where applicable, and how students are verified.
          </p>
          <Button
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Intellectus Funding — sponsor enquiry")}`}
            className="mt-8 rounded-full bg-white px-8 text-rose-700 hover:bg-rose-50"
          >
            Email Intellectus Funding
          </Button>
        </section>

        {profileToView && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="funding-profile-dialog-title"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setProfileToView(null);
            }}
          >
            <div
              className="relative max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setProfileToView(null)}
                className="absolute right-3 top-3 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close profile"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col gap-4 pr-8">
                <div className="flex items-start gap-4">
                  {profileToView.profileImageDataUrl ? (
                    <img
                      src={profileToView.profileImageDataUrl}
                      alt={`${profileToView.displayName} profile`}
                      className="h-16 w-16 shrink-0 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xl font-bold text-rose-700">
                      {profileToView.displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3
                      id="funding-profile-dialog-title"
                      className="text-xl font-bold text-slate-900"
                    >
                      {profileToView.displayName}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {profileToView.studyLevel} · {profileToView.city}
                      {typeof profileToView.age === "number"
                        ? ` · Age ${profileToView.age}`
                        : ""}
                    </p>
                    {profileToView.studentType === "highschool" &&
                      profileToView.highSchoolGrade && (
                        <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-rose-600">
                          {profileToView.highSchoolGrade}
                        </p>
                      )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold text-slate-800">
                      {profileToView.studentType === "highschool" ? "School" : "Institution"}
                      :{" "}
                    </span>
                    <span className="text-slate-700">{profileToView.institutionName}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">
                      {profileToView.studentType === "highschool"
                        ? "Main subjects / goals"
                        : "Field / course focus"}
                      :{" "}
                    </span>
                    <span className="text-rose-900">{profileToView.fieldOfStudy}</span>
                  </p>
                  <p className="flex flex-wrap items-center gap-x-1 text-slate-600">
                    <Mail className="inline h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                    <span className="break-all">{profileToView.studentEmail}</span>
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    About their goals
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {profileToView.bio}
                  </p>
                </div>

                {profileToView.transcriptName && (
                  <a
                    href={profileToView.transcriptDataUrl}
                    download={profileToView.transcriptName}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    <FileText className="h-4 w-4" aria-hidden />
                    Download transcript ({profileToView.transcriptName})
                  </a>
                )}

                <div className="flex flex-wrap gap-2">
                  {profileToView.needs?.map((n) => (
                    <span
                      key={n}
                      className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800"
                    >
                      {n}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400">Profile ID: {profileToView.id}</p>

                <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap">
                  {profileToView.needs?.some((n) => n.includes("Tutoring")) && (
                    <Button
                      href={fundingMailto(profileToView, "Tutoring sessions")}
                      className="rounded-full bg-rose-500 px-4 py-2 text-sm text-white hover:bg-rose-600"
                    >
                      Fund tutoring
                    </Button>
                  )}
                  {profileToView.needs?.some((n) => n.includes("Textbook")) && (
                    <Button
                      href={fundingMailto(profileToView, "Textbooks")}
                      variant="outline"
                      className="rounded-full border-amber-300 px-4 py-2 text-sm text-amber-900 hover:bg-amber-50"
                    >
                      Fund textbooks
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Funding;
