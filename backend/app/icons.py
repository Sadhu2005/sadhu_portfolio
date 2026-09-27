"""Map a skill name to a react-icons export. Unknown names use HiChip."""

from __future__ import annotations

ICON_BY_NAME = {
    "python": "SiPython",
    "dart": "SiDart",
    "next.js": "SiNextdotjs",
    "ollama": "SiOllama",
    "local llms": "SiOllama",
    "express": "SiExpress",
    "react native": "SiReact",
    "prisma": "SiPrisma",
    "redis": "SiRedis",
    "linux": "SiLinux",
    "mediapipe": "SiMediapipe",
    "c": "SiC",
    "c++": "SiCplusplus",
    "java": "SiOpenjdk",
    "kotlin": "SiKotlin",
    "html": "SiHtml5",
    "css": "SiCss",
    "javascript": "SiJavascript",
    "typescript": "SiTypescript",
    "node.js": "SiNodedotjs",
    "nodejs": "SiNodedotjs",
    "tensorflow": "SiTensorflow",
    "pytorch": "SiPytorch",
    "scikit-learn": "SiScikitlearn",
    "opencv": "SiOpencv",
    "jetpack compose": "SiJetpackcompose",
    "android sdk": "SiAndroid",
    "android studio": "SiAndroid",
    "flutter": "SiFlutter",
    "docker": "SiDocker",
    "jenkins": "SiJenkins",
    "github actions": "SiGithubactions",
    "digitalocean": "SiDigitalocean",
    "vercel": "SiVercel",
    "pm2": "SiPm2",
    "google cloud platform": "SiGooglecloud",
    "google cloud platform (gcp)": "SiGooglecloud",
    "flask": "SiFlask",
    "fastapi": "SiFastapi",
    "supabase": "SiSupabase",
    "rest apis": "SiPostman",
    "postman": "SiPostman",
    "firebase": "SiFirebase",
    "postgresql": "SiPostgresql",
    "mysql": "SiMysql",
    "mongodb": "SiMongodb",
    "git": "SiGit",
    "pycharm": "SiPycharm",
    "jupyter": "SiJupyter",
    "colab": "SiGooglecolab",
    "n8n": "SiN8N",
    "dockerhub": "SiDocker",
    "raspberry pi 5": "SiRaspberrypi",
    "arduino uno": "SiArduino",
    "esp32": "SiEspressif",
    "esp32-cam": "SiEspressif",
}


def icon_for(name: str, category: str = "") -> str:
    if category.strip().lower() == "languages":
        return "HiTranslate"
    key = name.strip().lower()
    base = key.split("(")[0].strip()
    return ICON_BY_NAME.get(key) or ICON_BY_NAME.get(base) or "HiChip"
