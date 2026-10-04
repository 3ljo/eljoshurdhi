import "./fonts";
import "./ad/fonts";
import { Composition, Folder } from "remotion";
import { MetaAd } from "./ad/MetaAd";
import { NothingHappened } from "./ad3/NothingHappened";
import { CtaScene as AdCtaScene } from "./ad/scenes/CtaScene";
import { HookScene } from "./ad/scenes/HookScene";
import { OfferScene } from "./ad/scenes/OfferScene";
import { PainScene } from "./ad/scenes/PainScene";
import { ProofScene } from "./ad/scenes/ProofScene";
import { Promo } from "./Promo";
import { CtaScene } from "./scenes/CtaScene";
import { IntroScene } from "./scenes/IntroScene";
import { LocationScene } from "./scenes/LocationScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { ProcessScene } from "./scenes/ProcessScene";
import { WhyMeScene } from "./scenes/WhyMeScene";
import { WorkScene } from "./scenes/WorkScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* "Nothing Happened.": the 20-second Meta ad, one component in three formats. */}
      <Folder name="NothingHappened">
        <Composition
          id="Ad3-Reels-9x16"
          component={NothingHappened}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Ad3-Feed-4x5"
          component={NothingHappened}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1350}
        />
        <Composition
          id="Ad3-Square-1x1"
          component={NothingHappened}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1080}
        />
      </Folder>
      {/* The 20-second Meta ad, one component in three formats. */}
      <Folder name="MetaAd">
        <Composition
          id="Ad-Reels-9x16"
          component={MetaAd}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Ad-Feed-4x5"
          component={MetaAd}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1350}
        />
        <Composition
          id="Ad-Square-1x1"
          component={MetaAd}
          durationInFrames={600}
          fps={30}
          width={1080}
          height={1080}
        />
        <Folder name="AdScenes">
          <Composition
            id="AdHook"
            component={HookScene}
            durationInFrames={90}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="AdPain"
            component={PainScene}
            durationInFrames={135}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="AdProof"
            component={ProofScene}
            durationInFrames={165}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="AdOffer"
            component={OfferScene}
            durationInFrames={105}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id="AdCta"
            component={AdCtaScene}
            durationInFrames={105}
            fps={30}
            width={1080}
            height={1920}
          />
        </Folder>
      </Folder>
      <Composition
        id="Promo"
        component={Promo}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Connected compositions: each scene can be opened on its own timeline. */}
      <Folder name="Scenes">
        <Composition
          id="Intro"
          component={IntroScene}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            firstName: "Eljo",
            lastName: "Shurdhi",
            role: "Frontend Developer",
          }}
        />
        <Composition
          id="Location"
          component={LocationScene}
          durationInFrames={135}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ city: "Tirana,", country: "Albania" }}
        />
        <Composition
          id="Problem"
          component={ProblemScene}
          durationInFrames={260}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ fix: "Let's fix that." }}
        />
        <Composition
          id="Process"
          component={ProcessScene}
          durationInFrames={260}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ label: "HOW IT WORKS" }}
        />
        <Composition
          id="Work"
          component={WorkScene}
          durationInFrames={315}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ label: "SELECTED WORK" }}
        />
        <Composition
          id="WhyMe"
          component={WhyMeScene}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Cta"
          component={CtaScene}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            headline: "Custom websites",
            highlight: "that convert.",
            button: "Start My Project",
            fullName: "Eljo Shurdhi",
            subtitle: "Frontend Developer · Tirana, Albania",
            url: "eljoshurdhi.vercel.app",
          }}
        />
      </Folder>
    </>
  );
};
